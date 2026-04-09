<script lang="ts">
    import { onMount } from "svelte";
    import {fetchTextIDs, fetchFileIDs} from "./lib/methods";

    import RawText from "./lib/rawText.svelte";
    import RawFiles from "./lib/rawFiles.svelte";
    import Experience from "./lib/experience.svelte";
    import Education from "./lib/education.svelte";
    import Projects from "./lib/projects.svelte";
    import Config from "./lib/config.svelte";

    let activeTab = 'text'; // Default to text tab

    const tabs = [
        { id: 'text', label: 'Text Content', component: RawText },
        { id: 'files', label: 'File Upload', component: RawFiles },
        { id: 'experience', label: 'Experience', component: Experience },
        { id: 'education', label: 'Education', component: Education },
        { id: 'projects', label: 'Projects', component: Projects },
        { id: 'config', label: 'Site Config', component: Config }
    ];

  // Fetch existing IDs when mounted to DOM
  onMount(async () => {
    await fetchTextIDs();
    await fetchFileIDs();
  });
</script>


<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">

  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Admin Portal</h1>
    <p class="text-center text-gray-400 mb-8">made with only the finest AI slop ui</p>

    <!-- Tab Navigation -->
    <div class="flex flex-wrap justify-center mb-8 bg-gray-800 rounded-xl p-2 border border-gray-700 shadow-lg">
      {#each tabs as tab}
        <button
          class="px-6 py-3 mx-1 mb-2 rounded-lg font-medium transition-all duration-200 {activeTab === tab.id ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}"
          on:click={() => activeTab = tab.id}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <!-- Tab Content -->
    <div class="flex justify-center">
      {#each tabs as tab}
        {#if activeTab === tab.id}
          <svelte:component this={tab.component} />
        {/if}
      {/each}
    </div>
  </div>

</div>