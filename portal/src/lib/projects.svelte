<script lang="ts">
import { onMount } from "svelte";

import { dragActive } from "./variables";

import {projectTextID, selectedProjectFilePreview, title, description, tech, tags, demo, github, featured, image, projectIDs, selectedProject } from "./projectsMethods";

import { createProject, listProjects , deleteProject, updateProject, handleProjectImage, handleProjectImageDrop, previewProject } from "./projectsMethods";

  // Fetch existing IDs when mounted to DOM
  onMount(async () => {
    await listProjects();
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
        Create Project
      </button>
      <button
        class="px-6 py-3 mx-1 rounded-lg font-medium transition-all duration-200 {activeSubTab === 'manage' ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}"
        on:click={() => activeSubTab = 'manage'}
      >
        Manage Projects
      </button>
    </div>
  </div>

  <!-- Create Projects Tab -->
  {#if activeSubTab === 'create'}
  <div class="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 w-full max-w-lg border border-gray-700">
    <h2 class="text-xl font-semibold text-white mb-4">Create Project</h2>

    <!-- Form -->
    <div class="space-y-4">
      <input placeholder="Text ID" bind:value={$projectTextID} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Title" bind:value={$title} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <textarea placeholder="Description" bind:value={$description} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-vertical" rows="3"></textarea>
      <input placeholder="Tech (comma separated)" bind:value={$tech} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Tags (comma separated)" bind:value={$tags} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Demo URL" bind:value={$demo} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="GitHub URL" bind:value={$github} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <label class="flex items-center space-x-3 p-3 bg-gray-750 rounded-lg border border-gray-600">
        <input type="checkbox" bind:checked={$featured} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
        <span class="text-gray-300 font-medium">Featured Project</span>
      </label>

      <!-- drag and drop file upload -->
      <div
          role="button"
          tabindex="0"
          class="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-750 transition-colors"
          on:drop={handleProjectImageDrop}
          on:dragover={(e) => { e.preventDefault(); dragActive.set(true) }}
          on:dragleave={() => dragActive.set(false)}
      >
              {#if $image}
              <p class="text-green-400 font-medium">Selected file: {$image.name}</p>
              {:else}
              <p class="text-gray-300 {$dragActive ? 'text-blue-400' : ''}">Drag & drop an image here, or click to select</p>
              <p class="text-sm text-gray-500 mt-1">PNG, JPG, SVG files supported</p>
              {/if}

              <input type="file" class="hidden" on:change={handleProjectImage} />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex space-x-3 mt-6">
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800" on:click={createProject}>Create</button>
    </div>
  </div>
  {/if}

  <!-- Manage Projects Tab -->
  {#if activeSubTab === 'manage'}
  <div class="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 w-full max-w-lg border border-gray-700">
    <h2 class="text-xl font-semibold text-white mb-4">Manage Project</h2>

    <!-- Select project -->
    <select bind:value={$selectedProject} on:change={() => previewProject()} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors">
      <option value="" disabled selected>Select Project</option>
      {#each $projectIDs as proj}
        <option value={proj}>{proj}</option>
      {/each}
    </select>

    <!-- Form -->
    <div class="space-y-4">
      <input placeholder="Title" bind:value={$title} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <textarea placeholder="Description" bind:value={$description} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-vertical" rows="3"></textarea>
      <input placeholder="Tech (comma separated)" bind:value={$tech} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Tags (comma separated)" bind:value={$tags} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="Demo URL" bind:value={$demo} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <input placeholder="GitHub URL" bind:value={$github} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
      <label class="flex items-center space-x-3 p-3 bg-gray-750 rounded-lg border border-gray-600">
        <input type="checkbox" bind:checked={$featured} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
        <span class="text-gray-300 font-medium">Featured Project</span>
      </label>

      <!-- drag and drop file upload -->
      <div
          role="button"
          tabindex="0"
          class="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-750 transition-colors"
          on:drop={handleProjectImageDrop}
          on:dragover={(e) => { e.preventDefault(); dragActive.set(true) }}
          on:dragleave={() => dragActive.set(false)}
      >
              {#if $image}
              <p class="text-green-400 font-medium">Selected file: {$image.name}</p>
              {:else}
              <p class="text-gray-300 {$dragActive ? 'text-blue-400' : ''}">Drag & drop an image here, or click to select</p>
              <p class="text-sm text-gray-500 mt-1">PNG, JPG, SVG files supported</p>
              {/if}

          <input type="file" class="hidden" on:change={handleProjectImage} />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex space-x-3 mt-6">
      <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800" on:click={updateProject}>Update</button>
      <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800" on:click={deleteProject}>Delete</button>
    </div>
  </div>
  {/if}

  <!-- Preview Widget - Shows in both tabs -->
  {#if $selectedProjectFilePreview}
  <div class="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg border border-gray-700">
    <h3 class="text-lg font-semibold text-white mb-4">Project Image Preview</h3>
    <div class="flex flex-col items-center space-y-4">
      <div class="overflow-hidden rounded-2xl aspect-square bg-white/[0.03] border border-white/[0.08] w-48 h-48">
        <img src={$selectedProjectFilePreview} alt="Preview" class="w-full h-full object-cover object-center" />
      </div>
      <p class="text-sm text-gray-400 text-center">This is how the project image will appear on your portfolio</p>
    </div>
  </div>
  {/if}
</div>