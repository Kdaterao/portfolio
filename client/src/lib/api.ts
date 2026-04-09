// API utilities for connecting to the backend server
const API_BASE = "http://localhost:3000/mongo";
const API_R2 = "http://localhost:3000/r2";

// Types for our data
export interface Project {
  textID: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  tags?: string[];
  demo?: string;
  github?: string;
  featured?: boolean;
}

export interface Experience {
  textID: string;
  company: string;
  role: string;
  start: string;
  end: string;
  description: string;
  tech?: string[];
  logo?: string;
}

export interface Education {
  textID: string;
  school: string;
  location?: string;
  logo?: string;
  degree: string;
  field: string;
  minor?: string;
  start: string;
  end: string;
  gpa?: string;
  current?: boolean;
}

export interface SiteConfig {
  fullText?: string;
  eyebrowText?: string;
  subHeadlineText?: string;
  bio?: string;
  resume?: string;
  linkedin?: string;
  github?: string;
  tags?: string[];
}

export interface Image {
  imageID: string;
  r2ID: string;
  title?: string;
  description?: string;
  featured?: boolean;
}



const defaultHeaders = {
  'x-api-key': import.meta.env.VITE_API_KEY || '',
  'Content-Type': 'application/json',
};

// API functions
export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE}/list/projects` , { headers: defaultHeaders });
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function fetchExperiences(): Promise<Experience[]> {
  try {
    const response = await fetch(`${API_BASE}/list/experiences` , { headers: defaultHeaders });
    const data = await response.json();
    return data.experiences || [];
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

export async function fetchEducations(): Promise<Education[]> {
  try {
    const response = await fetch(`${API_BASE}/list/educations` , { headers: defaultHeaders });
    const data = await response.json();
    return data.educations || [];
  } catch (error) {
    console.error("Error fetching educations:", error);
    return [];
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  try {
    const response = await fetch(`${API_BASE}/get/config`, { headers: defaultHeaders });
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error("Error fetching site config:", error);
    return {};
  }
}

// Helper function to get signed URLs for images
export async function getImageUrl(key: string): Promise<string> {
  try {
    const response = await fetch(`${API_R2}/get/file?key=${key}`, { method: "GET", headers: defaultHeaders });
    const data = await response.json();
    return data.url || "";
  } catch (error) {
    console.error("Error getting image URL:", error);
    return "";
  }
}

// Fetch all photos from MongoDB
export async function fetchPhotos(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/list/images`, {headers: defaultHeaders });
    const data = await response.json();
    const images = data.images || [];

    // Convert r2ID keys to signed URLs
    const photoUrls = await Promise.all(
      images.map(async (image: any) => {
        if (image.r2ID) {
          return await getImageUrl(image.r2ID);
        }
        return "";
      })
    );

    return photoUrls.filter(url => url !== "");
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
}