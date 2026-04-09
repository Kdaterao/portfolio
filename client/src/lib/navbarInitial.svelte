<script lang="ts">

  const resume = "https://drive.google.com/file/d/1os2i3lNXyaYk1BFNxFW34SFMe1hXd_Sh/view?usp=sharing";
  const linkedin = "https://www.linkedin.com/in/krishdaterao/"
  const github = "https://github.com/Kdaterao?tab=repositories";

  const links = [
    { label: "About", section: "about"},
    { label: "Projects", section: "projects" },
    { label: "Experience", section: "experience"},
  ];

  function scroll(section: string){
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    console.log("done!");
  }

</script>


  <!-- Nav bar -->
    <nav class="relative z-[10] flex items-center 
            justify-between 
            gap-4 px-4 sm:px-6 md:px-12 py-4
            border-b border-white/[0.07] backdrop-blur-sm">
 
      <span class="text-lg tracking font-bold text-white mr-auto cursor-pointer hidden sm:block">KD</span>

    <ul class="flex  invisible sm:block gap-3 lg:gap-8 list-none">
      {#each links as { label, section}}
        <li>
          <button
          onclick={() => scroll(section)} class="cursor-pointer text-[0.85rem] tracking-[0.06em] uppercase text-gray-500
                            no-underline transition-colors duration-200 hover:text-white hidden  md:block ">
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
       class="text-[0.75rem] tracking-[0.06em] uppercase text-[#f0efe9]
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


