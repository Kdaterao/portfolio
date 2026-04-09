<script lang="ts">
import { onMount } from "svelte";

import {fullText, eyebrowText, subHeadlineText, bio, resume, linkedin, github, tags } from "./configMethods";

import { loadConfig, updateConfig } from "./configMethods";

  // Load config when mounted to DOM
  onMount(async () => {
    await loadConfig();
  });
</script>

<!-- ========================= -->
      <!-- Site Config -->
<!-- ========================= -->

<div class="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 w-full max-w-lg border border-gray-700">
  <h2 class="text-xl font-semibold text-white mb-4">Site Configuration</h2>

  <!-- Form -->
  <div class="space-y-4">
    <input placeholder="Full Text" bind:value={$fullText} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
    <input placeholder="Eyebrow Text" bind:value={$eyebrowText} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
    <input placeholder="Sub Headline Text" bind:value={$subHeadlineText} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
    <textarea placeholder="Bio" bind:value={$bio} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-vertical" rows="4"></textarea>
    <input placeholder="Resume URL" bind:value={$resume} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
    <input placeholder="LinkedIn URL" bind:value={$linkedin} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
    <input placeholder="GitHub URL" bind:value={$github} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
    <input placeholder="Tags (comma separated)" bind:value={$tags} class="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" />
  </div>

  <!-- Buttons -->
  <div class="flex space-x-3 mt-6">
    <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800" on:click={loadConfig}>Load Current</button>
    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800" on:click={updateConfig}>Update</button>
  </div>
</div>