<script lang="ts">
  import { onMount } from 'svelte';
  let y: number;
  let threshold = 150;

  const links = [
    { label: "About", section: "about"},
    { label: "Projects", section: "projects" },
    { label: "Experience", section: "experience"},
  ];



  const resume = "https://drive.google.com/file/d/1os2i3lNXyaYk1BFNxFW34SFMe1hXd_Sh/view?usp=sharing";
  const linkedin = "https://www.linkedin.com/in/krishdaterao/"
  const github = "https://github.com/Kdaterao?tab=repositories";

  function scroll(section: string){
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    console.log("done!");
  }

</script>

 <svelte:window bind:scrollY={y}/>

<div class=" hidden sm:block fixed top-6 left-0 right-0 z-50 sm:flex justify-center"
    class:pointer-events-auto={y > threshold}
    class:pointer-events-none={y <= threshold}>
  <nav class="transition-all transform duration-700 ease-out
              bg-white/5 backdrop-blur-md border border-white/10 rounded-full
              flex items-center gap-8 px-5 py-[0.55rem] pointer-events-auto"
     class:opacity-100={y > threshold}
     class:opacity-0={y <= threshold}
     class:pointer-events-auto={y > threshold}
     class:pointer-events-none={y <= threshold}
     class:translate-y-0={y > threshold}
     class:-translate-y-4={y <= threshold}>
    <button onclick={() => scroll("hero")} class=" cursor-pointer mr-auto">
      <span class="text-lg tracking font-bold text-white ">KD</span>
    </button>

    <ul class="flex md:gap-3 lg:gap-6 list-none m-0 p-0  ">
      {#each links as { label, section }}
        <li>
          <button
          onclick={() => scroll(section)} class=" cursor-pointer text-[0.85rem] tracking-[0.06em] uppercase text-gray-500
                             transition-colors duration-200 hover:text-white hidden md:block ">
            {label}
          </button>
        </li>
      {/each}
    </ul>

    <a href={resume} target="_blank" rel="noopener"
       class="text-[0.75rem] tracking-[0.06em] uppercase text-[#f0efe9]
              border border-white/25 px-4 py-[0.4rem] rounded-full no-underline
              transition-all duration-200 hover:bg-white/[0.08] hover:border-white/45">
      Resume
    </a>
    <a href={github} target="_blank" rel="noopener"
       class=" text-[0.75rem] tracking-[0.06em] uppercase text-[#f0efe9]
              border border-white/25 px-4 py-[0.4rem] rounded-full no-underline
              transition-all duration-200 hover:bg-white/[0.08] hover:border-white/45">
      GitHub
    </a>
    <a href={linkedin} target="_blank" rel="noopener"
       class="text-[0.75rem] tracking-[0.06em] uppercase text-[#f0efe9]
              border border-white/25 px-4 py-[0.4rem] rounded-full no-underline
              transition-all duration-200 hover:bg-white/[0.08] hover:border-white/45">
      LinkedIn
    </a>
  </nav>
</div>