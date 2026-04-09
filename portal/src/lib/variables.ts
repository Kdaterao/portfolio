import { writable } from "svelte/store";


/*
import {
  newTextID, newContent, selectedTextID, selectedContent,textIDs,
  newFileID, file, selectedFileID, dragActive, fileIDs, API_MONGO,API_R2
} from "./variables";
*/


//====================================
//            Helper 
//====================================
async function getStoreValue<T>(store: any): Promise<T> {
  let value: T;
  store.subscribe((v: T) => value = v)(); // immediately unsubscribe
  return value!;
}


// Text inputs
export const newTextID = writable("");
export const newContent = writable("");
export const selectedTextID = writable("");
export const selectedContent = writable("");
export const textIDs = writable<string[]>([]);

// File inputs
export const newFileID = writable("");
export const file = writable<File | null>(null);
export const selectedFileID = writable("");
export const dragActive = writable(false);
export const fileIDs = writable<string[]>([]);
export const selectedFilePreview = writable<string | null>(null);


export const API_MONGO = import.meta.env.VITE_API_MONGO;
export const API_R2 = import.meta.env.VITE_API_R2;

export const defaultHeaders = {
  'x-api-key': import.meta.env.VITE_API_KEY || '',
  'Content-Type': 'application/json',
};