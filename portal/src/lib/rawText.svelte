<script lang="ts">
    import { 
    newTextID, newContent, textIDs, selectedTextID, selectedContent, 
    } from "./variables";

    import { addText, deleteText, updateText } from "./methods";


    

</script>




<!-- ========================= -->
      <!-- Add text -->
<!-- ========================= -->

  <div class="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 w-full max-w-lg">
    <h2 class="text-xl font-semibold">Add New Text</h2>

    <!-- input  -->
    <input placeholder="Text ID" bind:value={$newTextID} class="w-full p-2 rounded-lg text-black" />
    <textarea placeholder="Content" rows="4" bind:value={$newContent} class="w-full p-2 rounded-lg text-black"></textarea>
    
    <!-- upload button-->
    <button class="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600" on:click={addText}>Add Text</button>
  </div>



<!-- ========================= -->
      <!-- Manage Text  -->
<!-- ========================= -->
  <div class="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 w-full max-w-lg">
    <h2 class="text-xl font-semibold">Manage Existing Text</h2>

    <!--- Get IDs -->
    <select bind:value={$selectedTextID} class="w-full p-2 rounded-lg text-black">
      <option value="" disabled selected>Select Text ID</option>
      {#each $textIDs as id}
        <option value={id}>{id}</option>
      {/each}
    </select>

    <!-- For updating text operation -->
    <textarea placeholder="Content" rows="4" bind:value={$selectedContent} class="w-full p-2 rounded-lg text-black"></textarea>
    
    <!--- Operations -->
    <div class="flex space-x-2">
      <button class="bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600" on:click={updateText}>Update</button>
      <button class="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600" on:click={deleteText}>Delete</button>
    </div>

  </div>
