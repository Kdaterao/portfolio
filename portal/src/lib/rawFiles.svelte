<script lang="ts">
import {
  newFileID, file, selectedFileID, dragActive, fileIDs, selectedFilePreview
} from "./variables";

import { handleFileDrop, handleFileSelect, uploadFile, deleteFile, getPreviewFile } from "./methods";


</script>


<div class="flex flex-wrap">

<!-- ========================= -->
      <!-- Upload file -->
<!-- ========================= -->
<div class="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 w-full max-w-lg ">
  <h2 class="text-xl font-semibold">Upload New File</h2>

  <!-- input file id for mongodb -->

  <input placeholder="File ID" bind:value={$newFileID} class="w-full p-2 rounded-lg text-black" />

  <!-- drag and drop file upload -->
  <div
    role="button"           
    tabindex="0"     
    class="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-white"
    on:drop={handleFileDrop}
    on:dragover={(e) => { e.preventDefault(); dragActive.set(true) }}
    on:dragleave={() => dragActive.set(false)}
   >

        {#if $file}
        <p>Selected file: {$file.name}</p>
        {:else}
        <p class={$dragActive ? "text-green-400" : ""}>Drag & drop a file here, or click to select</p>
        {/if}

        <input type="file" class="hidden" on:change={handleFileSelect} />

  </div>

  <!-- Preview for newly selected file -->
  {#if $selectedFilePreview && $file}
    <div class="mt-4 p-4 bg-gray-750 rounded-lg border border-gray-600">
      <p class="text-sm text-gray-400 mb-2">New File Preview:</p>
      <img src={$selectedFilePreview} alt="Preview" class="max-h-32 rounded-lg object-contain border border-gray-600" />
    </div>
  {/if}

  <!-- upload button -->
  <button class="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600" on:click={uploadFile}>Upload File</button>

</div>




<!-- ========================= -->
      <!-- Manage File -->
<!-- ========================= -->

<div class="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 w-full max-w-lg">
  <h2 class="text-xl font-semibold">Manage Existing File</h2>

  <!-- choose image id -->
  <select bind:value={$selectedFileID} on:change={() => getPreviewFile()} class="w-full p-2 rounded-lg text-black">
    <option value="" disabled selected>Select File ID</option>
    {#each $fileIDs as id}
      <option value={id}>{id}</option>
    {/each}
  </select>


    {#if $selectedFilePreview}
      <img 
    src={$selectedFilePreview} 
    alt="Preview"
    class= "w-50 h-70 md:w-60 md:h-80 lg:w-70 lg:h-90 rounded-xl"
      />
    {/if}

  <!-- delete it -->
  <div class="flex space-x-2">
    <button class="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600" on:click={deleteFile}>Delete File</button>
  </div>

</div>


</div>