<script lang="ts">
import { onMount } from "svelte";

import { dragActive } from "./variables";

import {educationTextID, selectedEducationFilePreview, school, degree, field, start, end, location, minor, gpa, current, logo, educationIDs, selectedEducation } from "./educationMethods";

import { createEducation, listEducations , deleteEducation, updateEducation, handleEducationLogo, handleEducationLogoDrop, previewEducation } from "./educationMethods";

  // Fetch existing IDs when mounted to DOM
  onMount(async () => {
    await listEducations();
  });

  let activeSubTab = 'create'; // Default to create tab
</script>

<div class="space-y-6">
  <!-- Sub-tabs -->
  <div class="flex justify-center mb-6">
    <div class="bg-gray-800 rounded-xl p-2 border border-gray-700 shadow-lg inline-flex">
      <button
        class="px-6 py-3 mx-1 rounded-lg font-medium transition-all duration-200 {activeSubTab === 'create' ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}"
        on:click={() => activeSubTab = 'create'}
      >
        Create Education
      </button>
      <button
        class="px-6 py-3 mx-1 rounded-lg font-medium transition-all duration-200 {activeSubTab === 'manage' ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}"
        on:click={() => activeSubTab = 'manage'}
      >
        Manage Education
      </button>
    </div>
  </div>

  <!-- Create Education Tab -->
  {#if activeSubTab === 'create'}
  <div class="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 w-full max-w-lg border border-gray-700">
    <h2 class="text-xl font-semibold text-white mb-4">Create Education</h2>

    <!-- Form -->
    <div class="space-y-4">
      <input placeholder="Text ID" bind:value={$educationTextID} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="School" bind:value={$school} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Degree" bind:value={$degree} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Field" bind:value={$field} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Start" bind:value={$start} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="End" bind:value={$end} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Location" bind:value={$location} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Minor" bind:value={$minor} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="GPA" bind:value={$gpa} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <label class="flex items-center space-x-3 p-3 bg-gray-750 rounded-lg border border-gray-600">
        <input type="checkbox" bind:checked={$current} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
        <span class="text-gray-300 font-medium">Current Education</span>
      </label>

      <!-- drag and drop file upload -->
      <div
          role="button"
          tabindex="0"
          class="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-750 transition-colors"
          on:drop={handleEducationLogoDrop}
          on:dragover={(e) => { e.preventDefault(); dragActive.set(true) }}
          on:dragleave={() => dragActive.set(false)}
      >
              {#if $logo}
              <p class="text-green-400 font-medium">Selected file: {$logo.name}</p>
              {:else}
              <p class="text-gray-300 {$dragActive ? 'text-blue-400' : ''}">Drag & drop a logo here, or click to select</p>
              <p class="text-sm text-gray-500 mt-1">PNG, JPG, SVG files supported</p>
              {/if}

              <input type="file" class="hidden" on:change={handleEducationLogo} />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex space-x-3 mt-6">
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800" on:click={createEducation}>Create</button>
    </div>
  </div>
  {/if}

  <!-- Manage Education Tab -->
  {#if activeSubTab === 'manage'}
  <div class="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 w-full max-w-lg border border-gray-700">
    <h2 class="text-xl font-semibold text-white mb-4">Manage Education</h2>

    <!-- Select education -->
    <select bind:value={$selectedEducation} on:change={() => previewEducation()} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors">
      <option value="" disabled selected>Select Education</option>
      {#each $educationIDs as edu}
        <option value={edu}>{edu}</option>
      {/each}
    </select>

    <!-- Form -->
    <div class="space-y-4">
      <input placeholder="School" bind:value={$school} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Degree" bind:value={$degree} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Field" bind:value={$field} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Start" bind:value={$start} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="End" bind:value={$end} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Location" bind:value={$location} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Minor" bind:value={$minor} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="GPA" bind:value={$gpa} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <label class="flex items-center space-x-3 p-3 bg-gray-750 rounded-lg border border-gray-600">
        <input type="checkbox" bind:checked={$current} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
        <span class="text-gray-300 font-medium">Current Education</span>
      </label>

      <!-- drag and drop file upload -->
      <div
          role="button"
          tabindex="0"
          class="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-750 transition-colors"
          on:drop={handleEducationLogoDrop}
          on:dragover={(e) => { e.preventDefault(); dragActive.set(true) }}
          on:dragleave={() => dragActive.set(false)}
      >
              {#if $logo}
              <p class="text-green-400 font-medium">Selected file: {$logo.name}</p>
              {:else}
              <p class="text-gray-300 {$dragActive ? 'text-blue-400' : ''}">Drag & drop a logo here, or click to select</p>
              <p class="text-sm text-gray-500 mt-1">PNG, JPG, SVG files supported</p>
              {/if}

          <input type="file" class="hidden" on:change={handleEducationLogo} />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex space-x-3 mt-6">
      <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800" on:click={updateEducation}>Update</button>
      <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800" on:click={deleteEducation}>Delete</button>
    </div>
  </div>
  {/if}

  <!-- Preview Widget - Shows in both tabs -->
  {#if $selectedEducationFilePreview}
  <div class="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg border border-gray-700">
    <h3 class="text-lg font-semibold text-white mb-4">Education Logo Preview</h3>
    <div class="flex flex-col items-center space-y-4">
      <div class="w-32 h-32 rounded-2xl bg-white p-4 flex items-center justify-center flex-shrink-0">
        <img src={$selectedEducationFilePreview} alt="Preview" class="w-full h-full object-contain" />
      </div>
      <p class="text-sm text-gray-400 text-center">This is how the school logo will appear on your portfolio</p>
    </div>
  </div>
  {/if}
</div>