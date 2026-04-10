


//made as seprate file since navbars use it too


import { writable } from "svelte/store";

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


export const fullText = writable("");
export const eyebrowText = writable("");
export const subHeadlineText = writable("");
export const bio = writable("");
export const linkedin = writable("");
export const github = writable("");
export const resume = writable("");
export const tags = writable<string[]>([]);



