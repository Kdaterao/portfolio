import { writable } from "svelte/store";
import { getStoreValue } from "./methods";
import { API_MONGO } from "./variables";

export const fullText = writable("");
export const eyebrowText = writable("");
export const subHeadlineText = writable("");
export const bio = writable("");
export const resume = writable("");
export const linkedin = writable("");
export const github = writable("");
export const tags = writable("");

async function clearForm() {
    fullText.set("");
    eyebrowText.set("");
    subHeadlineText.set("");
    bio.set("");
    resume.set("");
    linkedin.set("");
    github.set("");
    tags.set("");
}

export async function loadConfig() {
    try {
        const res = await fetch(`${API_MONGO}/get/config`);
        const data = await res.json();

        console.log("Fetched config:", data);

        fullText.set(data.fullText || "");
        eyebrowText.set(data.eyebrowText || "");
        subHeadlineText.set(data.subHeadlineText || "");
        bio.set(data.bio || "");
        resume.set(data.resume || "");
        linkedin.set(data.linkedin || "");
        github.set(data.github || "");
        tags.set(data.tags ? data.tags.join(", ") : "");
    } catch (err) {
        console.error("Error fetching config:", err);
    }
}

export async function updateConfig() {
  try {
    const fullTextVal = await getStoreValue<string>(fullText);
    const eyebrowTextVal = await getStoreValue<string>(eyebrowText);
    const subHeadlineTextVal = await getStoreValue<string>(subHeadlineText);
    const bioVal = await getStoreValue<string>(bio);
    const resumeVal = await getStoreValue<string>(resume);
    const linkedinVal = await getStoreValue<string>(linkedin);
    const githubVal = await getStoreValue<string>(github);
    const tagsVal = await getStoreValue<string>(tags);

    const payload = {
      fullText: fullTextVal,
      eyebrowText: eyebrowTextVal,
      subHeadlineText: subHeadlineTextVal,
      bio: bioVal,
      resume: resumeVal,
      linkedin: linkedinVal,
      github: githubVal,
      tags: tagsVal ? tagsVal.split(",").map((t: string) => t.trim()) : []
    };

    const res = await fetch(`${API_MONGO}/update/config`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Config updated!");
    } else {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      alert("Error: " + err.error);
    }
  } catch (err) {
    console.error("Error updating config:", err);
    alert("Unexpected error updating config");
  }
}