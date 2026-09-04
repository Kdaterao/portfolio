import { 
  file, newFileID, fileIDs, selectedFileID, dragActive, selectedFilePreview,
  API_MONGO, API_R2, defaultHeaders, fileHeaders
} from "./variables";




//====================================
//         helper function
//====================================
export async function getStoreValue<T>(store: any): Promise<T> {
  let value: T;
  store.subscribe((v: T) => value = v)(); // immediately unsubscribe
  return value!;
}


//====================================
//           File Methods
//====================================


export async function fetchFileIDs() {
  try {
    //fetch
    const res = await fetch(`${API_MONGO}/list/images`, { headers: defaultHeaders });
    const data = await res.json();

    //update store
    fileIDs.set(data.images?.map((i: any) => i.imageID) || []);
  } catch (err) {
    console.error("Error fetching file IDs:", err);
  }
}



export async function uploadFile() {
  // get store values
  const f = await getStoreValue<File | null>(file);
  const id = await getStoreValue<string>(newFileID);
  const ids = await getStoreValue<string[]>(fileIDs);

  //error handling
  if (!f || !id) return alert("Select a file and provide a File ID");

  const invalidChars = /[^a-zA-Z0-9._-]/g;
  if (invalidChars.test(f.name)) return alert("Invalid characters in file name");
  if (ids.includes(id)) return alert("File ID already exists!");

  //add current time to name to prevent duplicate
  const timestamp = Date.now();
  const key = `${timestamp}-${f.name}`;

  try {
    //body payload
    const formData = new FormData();
    formData.append("file", f);
    formData.append("folder", key);

    //upload file to r2
    const r2Res = await fetch(`${API_R2}/upload/file`, {headers: fileHeaders,  method: "POST", body: formData });
    const r2Data = await r2Res.json();
    if (!r2Data.key) return alert("Failed to upload file to R2");

    //upload fileID to mongodb
    const mongoRes = await fetch(`${API_MONGO}/add/image`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ imageID: id, r2ID: r2Data.key })
    });
    console.log(await mongoRes.json());

    //update store
    file.set(null);
    newFileID.set("");
    await fetchFileIDs();
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}



export async function deleteFile() {
  
  //get store variables
  const id = await getStoreValue<string>(selectedFileID);
  if (!id) return alert("Select a File ID to delete");

  try {
    //get r2ID from mongodb
    const getRes = await fetch(`${API_MONGO}/get/image?id=${id}`, { headers: defaultHeaders });
    if (!getRes.ok) return alert("Could not find file in MongoDB");
    const imageDoc = await getRes.json();
    const r2Key = imageDoc.r2ID;

    //delete from r2buck and mongodb
    await fetch(`${API_R2}/delete/file?key=${r2Key}`, { headers: defaultHeaders, method: "DELETE" });
    await fetch(`${API_MONGO}/delete/image?id=${id}`, { headers: defaultHeaders, method: "DELETE" });

    //update store
    selectedFileID.set("");
    await fetchFileIDs(); //update our id list

  } catch (err) {
    console.error("Error deleting file:", err);
    selectedFilePreview.set(null);
  }
}





export async function getPreviewFile() {
    const id = await getStoreValue<string>(selectedFileID);
    if (!id) return;

    try{
    //get r2ID from mongodb
    const getRes = await fetch(`${API_MONGO}/get/image?id=${id}`, { headers: defaultHeaders });
    if (!getRes.ok) return alert("Could not find file in MongoDB");
    const imageDoc = await getRes.json();
    const r2Key = imageDoc.r2ID;

    //get
    const res = await fetch(`${API_R2}/get/file?key=${r2Key}`, { headers: defaultHeaders, method: "GET" });
    const data = await res.json();
    

    if (data.url) {
      selectedFilePreview.set(data.url);
    } else {
      selectedFilePreview.set(null);
    }

    } catch (err) {
        console.error("Failed to load preview:", err);
        selectedFilePreview.set(null);
    }


  }


//====================================
//          UI File Methods
//====================================

export function handleFileDrop(e: DragEvent) {
  e.preventDefault();
  dragActive.set(false);
  const dt = e.dataTransfer;
  if (dt?.files.length) {
    file.set(dt.files[0]);
    selectedFilePreview.set(URL.createObjectURL(dt.files[0]));
  }
}

export function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) {
    file.set(input.files[0]);
    selectedFilePreview.set(URL.createObjectURL(input.files[0]));
  }
}
