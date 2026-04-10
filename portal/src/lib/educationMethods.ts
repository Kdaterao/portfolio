import { writable } from "svelte/store";
import { getStoreValue } from "./methods";
import { API_MONGO, API_R2, dragActive, defaultHeaders} from "./variables";

export const educationTextID = writable("");
export const school = writable("");
export const degree = writable("");
export const field = writable("");
export const start = writable("");
export const end = writable("");
export const location = writable("");
export const minor = writable("");
export const gpa = writable("");
export const current = writable(false);
export const logo = writable<File | null>(null);
export const educationIDs = writable<string[]>([]);
export const selectedEducation = writable("");
export const selectedEducationFilePreview = writable<string | null>(null);

async function clearForm() {
    educationTextID.set("");
    school.set("");
    degree.set("");
    field.set("");
    start.set("");
    end.set("");
    location.set("");
    minor.set("");
    gpa.set("");
    current.set(false);
    logo.set(null);
    selectedEducationFilePreview.set(null);
    selectedEducation.set("");
}

export async function createEducation() {
  try {
    const educationTextIDVal = await getStoreValue<string>(educationTextID);
    const schoolVal = await getStoreValue<string>(school);
    const degreeVal = await getStoreValue<string>(degree);
    const fieldVal = await getStoreValue<string>(field);
    const startVal = await getStoreValue<string>(start);
    const endVal = await getStoreValue<string>(end);
    const locationVal = await getStoreValue<string>(location);
    const minorVal = await getStoreValue<string>(minor);
    const gpaVal = await getStoreValue<string>(gpa);
    const currentVal = await getStoreValue<boolean>(current);
    const logoFile = await getStoreValue<File | null>(logo);
    const educationIDsVal = await getStoreValue<string[]>(educationIDs);

    if (!educationTextIDVal || !schoolVal || !degreeVal || !fieldVal || !startVal || !locationVal || !gpaVal || !logoFile) {
      return alert("All fields except end and minor are required!");
    }

    if(educationIDsVal.includes(educationTextIDVal)) return alert("Education ID already exists!");

    const invalidChars = /[^a-zA-Z0-9._-]/g;
    if (invalidChars.test(logoFile.name)) return alert("Invalid characters in file name");

    const timestamp = Date.now();
    const key = `${timestamp}-${logoFile.name}`;

    // Upload to R2
    const formData = new FormData();
    formData.append("file", logoFile);

    const r2Res = await fetch(`${API_R2}/upload/file`, {headers:  defaultHeaders, method: "POST", body: formData });
    const r2Data = await r2Res.json();
    if (!r2Data.key) return alert("Failed to upload file to R2");

    // Send to Mongo
    const payload = {
      textID: educationTextIDVal,
      school: schoolVal,
      degree: degreeVal,
      field: fieldVal,
      start: startVal,
      end: endVal,
      location: locationVal,
      minor: minorVal,
      gpa: gpaVal,
      current: currentVal,
      logo: r2Data.key  // Use the key returned by R2
    };

    const mongoRes = await fetch(`${API_MONGO}/add/education`, {
      method: "POST",
      headers: defaultHeaders ,
      body: JSON.stringify(payload)
    });

    if (mongoRes.ok) {
      alert("Education created!");
      clearForm();
      await listEducations();
    } else {
      const err = await mongoRes.json().catch(() => ({ error: "Unknown error" }));
      alert("Error: " + err.error);
    }
  } catch (err) {
    console.error("Error creating education:", err);
    alert("Unexpected error creating education");
  }
}

export async function listEducations() {
    try {
        const res = await fetch(`${API_MONGO}/list/educations`, {headers:  defaultHeaders});
        const data = await res.json();

        console.log("Fetched educations:", data);

        educationIDs.set(data.educations?.map((e: any) => e.textID) || []);
    } catch (err) {
        console.error("Error fetching education IDs:", err);
    }
}

export async function previewEducation() {
    const educationTextIDVal = await getStoreValue<string>(selectedEducation);
    if (!educationTextIDVal) return alert("Select an education to preview");
    try{
    const resMongo = await fetch(`${API_MONGO}/get/education?id=${educationTextIDVal}`,  {headers:  defaultHeaders});
    if (!resMongo.ok) return alert("Could not find education in MongoDB");
    const dataMongo = await resMongo.json();

    school.set(dataMongo.school);
    degree.set(dataMongo.degree);
    field.set(dataMongo.field);
    start.set(dataMongo.start);
    end.set(dataMongo.end);
    location.set(dataMongo.location);
    minor.set(dataMongo.minor);
    gpa.set(dataMongo.gpa);
    current.set(dataMongo.current);

    const resR2 = await fetch(`${API_R2}/get/file?key=${dataMongo.logo}`, { headers:  defaultHeaders, method: "GET" });
    const dataR2 = await resR2.json();

    if (dataR2.url) {
      console.log("Fetched logo URL:", dataR2.url);
      selectedEducationFilePreview.set(dataR2.url);
    } else {
      selectedEducationFilePreview.set(null);
    }

    } catch (err) {
        console.error("Failed to load preview:", err);
        selectedEducationFilePreview.set(null);
    }
}

export async function deleteEducation() {
    const id = await getStoreValue<string>(selectedEducation);
    if (!id) return alert("Select an education to delete");

    try {
        //get r2ID(logo) from mongodb
        const getRes = await fetch(`${API_MONGO}/get/education?id=${id}`, { headers:  defaultHeaders });
        if (!getRes.ok) return alert("Could not find file in MongoDB");
        const imageDoc = await getRes.json();
        const r2Key = imageDoc.logo;

        //delete from r2buck and mongodb
        await fetch(`${API_R2}/delete/file?key=${r2Key}`, {headers:  defaultHeaders, method: "DELETE" });
        await fetch(`${API_MONGO}/delete/education?id=${id}`, {headers:  defaultHeaders, method: "DELETE" });

        //update store
        await listEducations(); //update our id list
        clearForm();

    } catch (err) {
        console.error("Error deleting file:", err);
        selectedEducation.set("");
    }
}

export async function updateEducation() {
    const id = await getStoreValue<string>(selectedEducation);
    if (!id) return alert("Select an education to update");

    try {
        const schoolVal = await getStoreValue<string>(school);
        const degreeVal = await getStoreValue<string>(degree);
        const fieldVal = await getStoreValue<string>(field);
        const startVal = await getStoreValue<string>(start);
        const endVal = await getStoreValue<string>(end);
        const locationVal = await getStoreValue<string>(location);
        const minorVal = await getStoreValue<string>(minor);
        const gpaVal = await getStoreValue<string>(gpa);
        const currentVal = await getStoreValue<boolean>(current);
        const logoFile = await getStoreValue<File | null>(logo);

        if (!schoolVal || !degreeVal || !fieldVal || !startVal || !locationVal || !gpaVal) {
            return alert("All fields except end and minor are required!");
        }

        let logoKey = null;
        if (logoFile) {
            // Upload new logo to R2
            const formData = new FormData();
            formData.append("file", logoFile);

            const r2Res = await fetch(`${API_R2}/upload/file`, {headers:  defaultHeaders, method: "POST", body: formData });
            const r2Data = await r2Res.json();
            if (!r2Data.key) return alert("Failed to upload file to R2");
            logoKey = r2Data.key;

            // Optionally delete old logo
            const getRes = await fetch(`${API_MONGO}/get/education?id=${id}`, { headers:  defaultHeaders });
            if (getRes.ok) {
                const oldDoc = await getRes.json();
                if (oldDoc.logo) {
                    await fetch(`${API_R2}/delete/file?key=${oldDoc.logo}`, { headers:  defaultHeaders, method: "DELETE" });
                }
            }
        }

        // Prepare update payload
        const payload: any = {
            school: schoolVal,
            degree: degreeVal,
            field: fieldVal,
            start: startVal,
            end: endVal,
            location: locationVal,
            minor: minorVal,
            gpa: gpaVal,
            current: currentVal
        };

        if (logoKey) {
            payload.logo = logoKey;
        }

        const mongoRes = await fetch(`${API_MONGO}/update/education?id=${id}`, {
            method: "PUT",
            headers:  defaultHeaders,
            body: JSON.stringify(payload)
        });


        if (mongoRes.ok) {
            alert("Education updated!");
            clearForm();
            await listEducations();
        } else {
            const err = await mongoRes.json().catch(() => ({ error: "Unknown error" }));
            alert("Error: " + err.error);
        }
    } catch (err) {
        console.error("Error updating education:", err);
        alert("Unexpected error updating education");
    }
}

export function handleEducationLogoDrop(e: DragEvent) {
  e.preventDefault();
  dragActive.set(false);
  const dt = e.dataTransfer;
  if (dt?.files.length) {
    logo.set(dt.files[0]);
    selectedEducationFilePreview.set(URL.createObjectURL(dt.files[0]));
  }
}

export function handleEducationLogo(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) {
    logo.set(input.files[0]);
    selectedEducationFilePreview.set(URL.createObjectURL(input.files[0]));
  }
}