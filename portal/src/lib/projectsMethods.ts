import { writable } from "svelte/store";
import { getStoreValue } from "./methods";
import { API_MONGO, API_R2, dragActive, defaultHeaders} from "./variables";

export const projectTextID = writable("");
export const title = writable("");
export const description = writable("");
export const tech = writable("");
export const tags = writable("");
export const demo = writable("");
export const github = writable("");
export const featured = writable(false);
export const image = writable<File | null>(null);
export const projectIDs = writable<string[]>([]);
export const selectedProject = writable("");
export const selectedProjectFilePreview = writable<string | null>(null);

async function clearForm() {
    projectTextID.set("");
    title.set("");
    description.set("");
    tech.set("");
    tags.set("");
    demo.set("");
    github.set("");
    featured.set(false);
    image.set(null);
    selectedProjectFilePreview.set(null);
    selectedProject.set("");
}

export async function createProject() {
  try {
    const projectTextIDVal = await getStoreValue<string>(projectTextID);
    const titleVal = await getStoreValue<string>(title);
    const descriptionVal = await getStoreValue<string>(description);
    const techVal = await getStoreValue<string>(tech);
    const tagsVal = await getStoreValue<string>(tags);
    const demoVal = await getStoreValue<string>(demo);
    const githubVal = await getStoreValue<string>(github);
    const featuredVal = await getStoreValue<boolean>(featured);
    const imageFile = await getStoreValue<File | null>(image);
    const projectIDsVal = await getStoreValue<string[]>(projectIDs);

    if (!projectTextIDVal || !titleVal || !descriptionVal || !techVal || !tagsVal || !imageFile) {
      return alert("All fields except demo and github are required!");
    }

    if(projectIDsVal.includes(projectTextIDVal)) return alert("Project ID already exists!");

    const invalidChars = /[^a-zA-Z0-9._-]/g;
    if (invalidChars.test(imageFile.name)) return alert("Invalid characters in file name");

    // Upload to R2
    const formData = new FormData();
    formData.append("file", imageFile);

    const r2Res = await fetch(`${API_R2}/upload/file`, {headers: defaultHeaders, method: "POST", body: formData });
    const r2Data = await r2Res.json();
    if (!r2Data.key) return alert("Failed to upload file to R2");

    // Send to Mongo
    const payload = {
      textID: projectTextIDVal,
      title: titleVal,
      description: descriptionVal,
      tech: techVal,
      tags: tagsVal,
      demo: demoVal,
      github: githubVal,
      featured: featuredVal,
      image: r2Data.key  // Use the key returned by R2
    };

    const mongoRes = await fetch(`${API_MONGO}/add/project`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(payload)
    });

    if (mongoRes.ok) {
      alert("Project created!");
      clearForm();
      await listProjects();
    } else {
      const err = await mongoRes.json().catch(() => ({ error: "Unknown error" }));
      alert("Error: " + err.error);
    }
  } catch (err) {
    console.error("Error creating project:", err);
    alert("Unexpected error creating project");
  }
}

export async function listProjects() {
    try {
        const res = await fetch(`${API_MONGO}/list/projects` , { headers: defaultHeaders });
        const data = await res.json();

        console.log("Fetched projects:", data);

        projectIDs.set(data.projects?.map((p: any) => p.textID) || []);
    } catch (err) {
        console.error("Error fetching project IDs:", err);
    }
}

export async function previewProject() {
    const projectTextIDVal = await getStoreValue<string>(selectedProject);
    if (!projectTextIDVal) return alert("Select a project to preview");
    try{
    const resMongo = await fetch(`${API_MONGO}/get/project?id=${projectTextIDVal}`, { headers: defaultHeaders });
    if (!resMongo.ok) return alert("Could not find project in MongoDB");
    const dataMongo = await resMongo.json();

    title.set(dataMongo.title);
    description.set(dataMongo.description);
    tech.set(dataMongo.tech);
    tags.set(dataMongo.tags);
    demo.set(dataMongo.demo);
    github.set(dataMongo.github);
    featured.set(dataMongo.featured);

    const resR2 = await fetch(`${API_R2}/get/file?key=${dataMongo.image}`, { headers: defaultHeaders, method: "GET" });
    const dataR2 = await resR2.json();

    if (dataR2.url) {
      console.log("Fetched image URL:", dataR2.url);
      selectedProjectFilePreview.set(dataR2.url);
    } else {
      selectedProjectFilePreview.set(null);
    }

    } catch (err) {
        console.error("Failed to load preview:", err);
        selectedProjectFilePreview.set(null);
    }
}

export async function deleteProject() {
    const id = await getStoreValue<string>(selectedProject);
    if (!id) return alert("Select a project to delete");

    try {
        //get r2ID(image) from mongodb
        const getRes = await fetch(`${API_MONGO}/get/project?id=${id}`, { headers: defaultHeaders });
        if (!getRes.ok) return alert("Could not find file in MongoDB");
        const imageDoc = await getRes.json();
        const r2Key = imageDoc.image;

        //delete from r2buck and mongodb
        await fetch(`${API_R2}/delete/file?key=${r2Key}`, { headers: defaultHeaders, method: "DELETE" });
        await fetch(`${API_MONGO}/delete/project?id=${id}`, { headers: defaultHeaders, method: "DELETE" });

        //update store
        await listProjects(); //update our id list
        clearForm();

    } catch (err) {
        console.error("Error deleting file:", err);
        selectedProject.set("");
    }
}

export async function updateProject() {
    const id = await getStoreValue<string>(selectedProject);
    if (!id) return alert("Select a project to update");

    try {
        const titleVal = await getStoreValue<string>(title);
        const descriptionVal = await getStoreValue<string>(description);
        const techVal = await getStoreValue<string>(tech);
        const tagsVal = await getStoreValue<string>(tags);
        const demoVal = await getStoreValue<string>(demo);
        const githubVal = await getStoreValue<string>(github);
        const featuredVal = await getStoreValue<boolean>(featured);
        const imageFile = await getStoreValue<File | null>(image);

        if (!titleVal || !descriptionVal || !techVal || !tagsVal) {
            return alert("All fields except demo and github are required!");
        }

        let imageKey = null;
        if (imageFile) {
            // Upload new image to R2
            const formData = new FormData();
            formData.append("file", imageFile);

            const r2Res = await fetch(`${API_R2}/upload/file`, { headers: defaultHeaders, method: "POST", body: formData });
            const r2Data = await r2Res.json();
            if (!r2Data.key) return alert("Failed to upload file to R2");
            imageKey = r2Data.key;

            // Optionally delete old image
            const getRes = await fetch(`${API_MONGO}/get/project?id=${id}`, {headers: defaultHeaders});
            if (getRes.ok) {
                const oldDoc = await getRes.json();
                if (oldDoc.image) {
                    await fetch(`${API_R2}/delete/file?key=${oldDoc.image}`, { headers: defaultHeaders, method: "DELETE" });
                }
            }
        }

        // Prepare update payload
        const payload: any = {
            title: titleVal,
            description: descriptionVal,
            tech: techVal,
            tags: tagsVal,
            demo: demoVal,
            github: githubVal,
            featured: featuredVal
        };

        if (imageKey) {
            payload.image = imageKey;
        }

        const mongoRes = await fetch(`${API_MONGO}/update/project?id=${id}`, {
            method: "PUT",
            headers: defaultHeaders,
            body: JSON.stringify(payload)
        });

        if (mongoRes.ok) {
            alert("Project updated!");
            clearForm();
            await listProjects();
        } else {
            const err = await mongoRes.json().catch(() => ({ error: "Unknown error" }));
            alert("Error: " + err.error);
        }
    } catch (err) {
        console.error("Error updating project:", err);
        alert("Unexpected error updating project");
    }
}

export function handleProjectImageDrop(e: DragEvent) {
  e.preventDefault();
  dragActive.set(false);
  const dt = e.dataTransfer;
  if (dt?.files.length) {
    image.set(dt.files[0]);
    selectedProjectFilePreview.set(URL.createObjectURL(dt.files[0]));
  }
}

export function handleProjectImage(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) {
    image.set(input.files[0]);
    selectedProjectFilePreview.set(URL.createObjectURL(input.files[0]));
  }
}