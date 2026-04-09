<script lang="ts">
  import { onMount } from "svelte";
  import FadeIn from "./fadeIn.svelte";
  import SlideIn from "./slideIn.svelte";
  import { fetchProjects, getImageUrl, type Project } from "./api";

  let projects: Project[] = [];

  //----- allow focus on scroll element automatically ------
  let loading = true;
  
    let container: HTMLDivElement;
    const handleWheel = (e: WheelEvent) => {

      const isMD = window.innerWidth >= 768; // md breakpoint

      if (container && !isMD) {
        container.scrollLeft += e.deltaY;
        e.preventDefault(); 
      }
    };

  //------ get data -----
  onMount(async () => {
    try {
      const fetchedProjects = await fetchProjects();

      // Convert image keys to signed URLs
      const projectsWithUrls = await Promise.all(
        fetchedProjects.map(async (project) => ({
          ...project,
          tech: typeof (project as any).tech === 'string' ? (project as any).tech.split(',').map((t: string) => t.trim()) : project.tech || [],
          tags: typeof (project as any).tags === 'string' ? (project as any).tags.split(',').map((t: string) => t.trim()) : project.tags || [],
          image: project.image ? await getImageUrl(project.image) : ""
        }))
      );

      projects = projectsWithUrls;
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      loading = false;
    }


  });

  //----- filter (tabs) -----
  $: features = projects.filter((p) => p.featured); //list of featured cards
  $: rest = projects.filter((p) => !p.featured); // the rest..

  //----- get all unique tags(for tab) -----
  $: allTabs = ['All', 'Featured', ...new Set(rest.flatMap((p) => p.tags))]; 

  let activeTab = 'Featured';//default tab
 

  $: filtered =
    activeTab === 'All' ? [...features, ...rest] : //is activeTab all? --> show all cards
    activeTab === 'Featured' ? features : //is activeTab featured? --> show featured cards
    rest.filter((p) => p.tech.includes(activeTab));//filter based on tags otherwise
</script>





<section id="projects" class="py-24  px-6">
  <FadeIn>
    <div class="flex flex-col flex-wrap items-center mb-12">
        <p class="text-sm uppercase tracking-widest text-gray-400 mb-2">What I've Built</p>
        <h1 class="text-white text-[3.3rem] md:text-[4.0rem] font-bold flex  ">Featured Projects</h1>

    </div>
  </FadeIn>

  {#if projects.length}


    <!-- Tabs -->
    <div class="flex gap-2 flex-wrap mb-8 justify-center ">
      {#each allTabs as tab}
        <button
          on:click={() => activeTab = tab!}
          class="text-[0.72rem] tracking-wide uppercase px-4 py-1.5 rounded-full border
                 transition-all duration-200 cursor-pointer
                 {activeTab === tab
                   ? 'border-blue-400 text-blue-400 bg-blue-400/10'
                   : 'border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300'}"
        >
          {tab}
        </button>
      {/each}
    </div>
    
    <!-- Where auto scroll area -->
    <div  on:wheel|nonpassive={handleWheel} 
    class="block md:invisible absolute z-12  justify-center  mt-12 w-full h-2/4">
    </div>
   
   <!-- Cards -->
    <div
      bind:this={container}
      class="flex flex-row  justify-start md:justify-center gap-6
            overflow-x-auto md:flex-wrap
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-thumb]:border
            [&::-webkit-scrollbar-thumb]:border-white/5
            [&::-webkit-scrollbar-thumb]:bg-neutral-950
            [&::-webkit-scrollbar-thumb]:rounded-full">
      {#each filtered as project (project.title)}
      <SlideIn>
     <div
      class="flex justify-self-center 
            
            grid-cols  mb-16 rounded-2xl  border border-white/[0.50]
             
            w-90 h-150 flex-col
            sm:w-100 sm:h-150 sm:flex-col
            md:min-w-160 md:h-120 md:flex-row
             
             transition-all duration-300 hover:border-blue-400
             hover:shadow-xl shadow-blue-400/50 hover:translate-y-2 cursor-pointer
             
             "
    >
    
    <!-- image section of card -->
    <div class="flex flex-row items-center justify-center overflow-hidden   aspect-square 
              w-full h-1/2 p-5 
              sm:w-full sm:h-1/2 
              md:w-10/16 md:h-full md:mb-6
                      ">
        <img
            class="object-cover p-5  rounded-3xl border border-white/[0.1]
                    w-70 h-full
                    sm:w-80 sm:h-full
                    md:w-full md:h-90 md:mb-10
                  "
            src={project.image}
            alt={project.title}
            loading="lazy"
        />
    </div>

    <!-- text section of card-->

    <div class="flex flex-col gap-4 pr-10 pl-10 md:pl-2 md:pt-10 w-full h-3/8 md:w-7/16 md:h-full">
        {#if project.featured}
        <span
          class="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.1em] uppercase
                 text-blue-400 bg-blue-400/[0.1] outline outline-1 outline-blue-400/[0.5]
                 px-3 py-1 rounded-full w-fit " >
          <span class="w-[6px] h-[6px] rounded-full bg-blue-400"></span>
          Featured
        </span>
        {/if}

        <h3 class="text-2xl font-bold text-[#f0efe9] ">{project.title}</h3>
        <p class=" font-serif text-sm leading-relaxed text-gray-500 mb-auto line-clamp-10"> 
          {#each project.description.split('- ').filter(Boolean) as line}
          <span> - {line.trim()}</span><br>
          {/each}
        </p>


         
        <div class="flex flex-wrap gap-2">
          {#each project.tech as tag}
            <span
              class="text-[0.72rem] tracking-wide text-gray-400 bg-white/5
                     border border-white/[0.08] px-3 py-[3px] rounded-full"
            >
              {tag}
            </span>
          {/each}
        </div>

        <div class="flex gap-3 mt-1 mb-20">
          {#if project.demo}
            <a
              href={project.demo}
              target="_blank"
              rel="noopener"
              class="text-xs uppercase text-gray-500
                     border border-gray-500 px-4 py-2 rounded-full no-underline

                     transition-all duration-200 hover:text-white hover:border-white/25

                     hidden md:block
                     "
            >
              Live demo
            </a>
          {/if}
          {#if project.github}
            <a
              href={project.github}
              target="_blank"
              rel="noopener"
              class="text-xs uppercase text-gray-500
                     border border-gray-500 px-4 py-2 rounded-full no-underline

                     transition-all duration-200 hover:text-white hover:border-white/25

                     hidden md:block
                     " 
            >
              GitHub
            </a>
          {/if}
        </div>
      </div>
    
    </div>
    </SlideIn>
      {/each}
    </div>
  {/if}

</section>