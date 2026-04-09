import { writable } from "svelte/store";
import { getStoreValue } from "./methods";
import { API_MONGO, API_R2, dragActive, defaultHeaders} from "./variables";

export const experienceTextID = writable("");
export const company = writable("");
export const role = writable("");
export const start = writable("");
export const end = writable("");
export const description = writable("");
export const tech = writable("");
export const logo = writable<File | null>(null);
export const experienceIDs = writable<string[]>([]);
export const selectedExperience = writable("");
export const selectedExperienceFilePreview = writable<string | null>(null);

async function clearForm() {
    experienceTextID.set("");
    company.set("");
    role.set("");
    start.set("");
    end.set("");
    description.set("");
    tech.set("");
    logo.set(null);
    selectedExperienceFilePreview.set(null);
    selectedExperience.set("");

}


export async function createExperience() {
  try {
    const experienceTextIDVal = await getStoreValue<string>(experienceTextID);
    const companyVal = await getStoreValue<string>(company);
    const roleVal = await getStoreValue<string>(role);
    const startVal = await getStoreValue<string>(start);
    const endVal = await getStoreValue<string>(end);
    const descriptionVal = await getStoreValue<string>(description);
    const techVal = await getStoreValue<string>(tech);
    const logoFile = await getStoreValue<File | null>(logo);
    const experienceIDsVal = await getStoreValue<string[]>(experienceIDs);
    if (!experienceTextIDVal || !companyVal || !roleVal || !startVal || !endVal || !descriptionVal || !techVal || !logoFile) {
      return alert("All fields except logo are required!");
    }
    
    if(experienceIDsVal.includes(experienceTextIDVal)) return alert("Experience ID already exists!");

    const invalidChars = /[^a-zA-Z0-9._-]/g;
    if (invalidChars.test(logoFile.name)) return alert("Invalid characters in file name");

    const timestamp = Date.now();
    const key = `${timestamp}-${logoFile.name}`;

    // Upload to R2
    const formData = new FormData();
    formData.append("file", logoFile);
    formData.append("fileID", key);

    const r2Res = await fetch(`${API_R2}/upload/file`, {headers: defaultHeaders,  method: "POST", body: formData });
    const r2Data = await r2Res.json();
    if (!r2Data.key) return alert("Failed to upload file to R2");

    // Send to Mongo
    const payload = {
      textID: experienceTextIDVal,
      company: companyVal,
      role: roleVal,
      start: startVal,
      end: endVal,
      description: descriptionVal,
      tech: techVal,
      logo: r2Data.key
    };

    const mongoRes = await fetch(`${API_MONGO}/add/experience`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(payload)
    });

    if (mongoRes.ok) {
      alert("Experience created!");
      clearForm();
      await listExperiences();
    } else {
      const err = await mongoRes.json().catch(() => ({ error: "Unknown error" }));
      alert("Error: " + err.error);
    }
  } catch (err) {
    console.error("Error creating experience:", err);
    alert("Unexpected error creating experience");
  }
}



export async function listExperiences() {

    try {
        //fetch
        const res = await fetch(`${API_MONGO}/list/experiences`, { headers: defaultHeaders });
        const data = await res.json();

        console.log("Fetched experiences:", data);

        //update store
        experienceIDs.set(data.experiences?.map((i: any) => i.textID) || []);
    } catch (err) {
        console.error("Error fetching experience IDs:", err);
    }
}


export async function previewExperience() {

    const experienceTextIDVal = await getStoreValue<string>(selectedExperience);
    if (!experienceTextIDVal) return alert("Select an experience to preview");
    try{
    const resMongo = await fetch(`${API_MONGO}/get/experience?id=${experienceTextIDVal}` , { headers: defaultHeaders });
    if (!resMongo.ok) return alert("Could not find experience in MongoDB");
    const dataMongo = await resMongo.json();

    company.set(dataMongo.company);
    role.set(dataMongo.role);
    start.set(dataMongo.start);
    end.set(dataMongo.end);
    description.set(dataMongo.description);
    tech.set(dataMongo.tech);

    
    const resR2 = await fetch(`${API_R2}/get/file?key=${dataMongo.logo}`, { headers: defaultHeaders, method: "GET" });
    const dataR2 = await resR2.json();
      
    if (dataR2.url) {
      console.log("Fetched logo URL:", dataR2.url);

      selectedExperienceFilePreview.set(dataR2.url);
    } else {
      selectedExperienceFilePreview.set(null);
    }

    } catch (err) {
        console.error("Failed to load preview:", err);
        selectedExperienceFilePreview.set(null);
    }
}




export async function deleteExperience() {

    const id = await getStoreValue<string>(selectedExperience);
    if (!id) return alert("Select an experience to delete");

    try {
        //get r2ID(logo) from mongodb
        const getRes = await fetch(`${API_MONGO}/get/experience?id=${id}`, {headers: defaultHeaders });
        if (!getRes.ok) return alert("Could not find file in MongoDB");
        const imageDoc = await getRes.json();
        const r2Key = imageDoc.logo;

        //delete from r2buck and mongodb
        await fetch(`${API_R2}/delete/file?key=${r2Key}`, { headers: defaultHeaders, method: "DELETE" });
        await fetch(`${API_MONGO}/delete/experience?id=${id}`, { headers: defaultHeaders, method: "DELETE" });


        //update store
        await listExperiences(); //update our id list
        clearForm();

    } catch (err) {
        console.error("Error deleting file:", err);
        selectedExperience.set("");
    }

}

export async function updateExperience() {
    const id = await getStoreValue<string>(selectedExperience);
    if (!id) return alert("Select an experience to update");

    try {
        const companyVal = await getStoreValue<string>(company);
        const roleVal = await getStoreValue<string>(role);
        const startVal = await getStoreValue<string>(start);
        const endVal = await getStoreValue<string>(end);
        const descriptionVal = await getStoreValue<string>(description);
        const techVal = await getStoreValue<string>(tech);
        const logoFile = await getStoreValue<File | null>(logo);

        if (!companyVal || !roleVal || !startVal || !endVal || !descriptionVal || !techVal) {
            return alert("All fields except logo are required!");
        }

        let logoKey = null;
        if (logoFile) {
            // Upload new logo to R2
            const formData = new FormData();
            formData.append("file", logoFile);

            const r2Res = await fetch(`${API_R2}/upload/file`, { headers: defaultHeaders, method: "POST", body: formData });
            const r2Data = await r2Res.json();
            if (!r2Data.key) return alert("Failed to upload file to R2");
            logoKey = r2Data.key;

            // Optionally delete old logo
            const getRes = await fetch(`${API_MONGO}/get/experience?id=${id}`, {headers: defaultHeaders});
            if (getRes.ok) {
                const oldDoc = await getRes.json();
                if (oldDoc.logo) {
                    await fetch(`${API_R2}/delete/file?key=${oldDoc.logo}`, { headers: defaultHeaders, method: "DELETE" });
                }
            }
        }

        // Prepare update payload
        const payload: any = {
            company: companyVal,
            role: roleVal,
            start: startVal,
            end: endVal,
            description: descriptionVal,
            tech: techVal
        };

        if (logoKey) {
            payload.logo = logoKey;
        }

        const mongoRes = await fetch(`${API_MONGO}/update/experience?id=${id}`, {
            method: "PUT",
            headers: defaultHeaders,
            body: JSON.stringify(payload)
        });

        if (mongoRes.ok) {
            alert("Experience updated!");
            clearForm();
            await listExperiences();
        } else {
            const err = await mongoRes.json().catch(() => ({ error: "Unknown error" }));
            alert("Error: " + err.error);
        }
    } catch (err) {
        console.error("Error updating experience:", err);
        alert("Unexpected error updating experience");
    }
}


export function handleExperiencelogoDrop(e: DragEvent) {
  e.preventDefault();
  dragActive.set(false);
  const dt = e.dataTransfer;
  if (dt?.files.length) {
    logo.set(dt.files[0]);
    selectedExperienceFilePreview.set(URL.createObjectURL(dt.files[0]));
  }
}

export function handleExperiencelogo(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) {
    logo.set(input.files[0]);
    selectedExperienceFilePreview.set(URL.createObjectURL(input.files[0]));
  }
}


