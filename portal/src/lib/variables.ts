import { writable } from "svelte/store";


/*
import {
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


// File inputs
export const newFileID = writable("");
export const file = writable<File | null>(null);
export const selectedFileID = writable("");
export const dragActive = writable(false);
export const fileIDs = writable<string[]>([]);
export const selectedFilePreview = writable<string | null>(null);


export const API_MONGO = import.meta.env.VITE_API_MONGO;
export const API_R2 = import.meta.env.VITE_API_R2;
export const API_SERVER = import.meta.env.VITE_API || String(import.meta.env.VITE_API_MONGO || '').replace(/\/mongo\/?$/, '');


export const defaultHeaders = {
  'x-api-key': import.meta.env.VITE_API_KEY || '',
  'Content-Type': 'application/json',
};

export const fileHeaders = {
  'x-api-key': import.meta.env.VITE_API_KEY || '',
};