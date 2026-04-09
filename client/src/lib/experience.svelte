<script lang="ts">
    import { onMount } from "svelte";
    import FadeIn from "./fadeIn.svelte";
    import SlideIn from "./slideIn.svelte";
    import { fetchExperiences, getImageUrl, type Experience } from "./api";

    let experiences: Experience[] = [];
    let loading = true;

    onMount(async () => {
        try {
            const fetchedExperiences = await fetchExperiences();

            // Convert logo keys to signed URLs
            const experiencesWithUrls = await Promise.all(
                fetchedExperiences.map(async (experience) => ({
                    ...experience,
                    tech: typeof (experience as any).tech === 'string' ? (experience as any).tech.split(',').map((t: string) => t.trim()) : experience.tech || [],
                    logo: experience.logo ? await getImageUrl(experience.logo) : ""
                }))
            );

            experiences = experiencesWithUrls;
        } catch (error) {
            console.error("Error loading experiences:", error);
        } finally {
            loading = false;
        }
    });
</script>

<section id="experience" class="">
  <FadeIn>
    <div class="flex flex-col items-center mb-16">
        <p class="text-sm uppercase tracking-widest text-gray-400 mb-2">Where I've Worked</p>
        <h1 class="text-white  text-[4.0rem] font-bold">Experience</h1>
        <div class="mt-4 h-1 w-16 bg-blue-500 rounded-full"></div>
    </div>
  </FadeIn>

  <div class="relative max-w-6xl mx-auto">

    <!-- Vertical line (centered, md+) -->
    <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-white/10"></div>

    <!-- Mobile line (on the left) -->
    <div class="block md:hidden absolute left-6 top-0 bottom-0 w-1 bg-white/10 ml-3"></div>

    <!-- Cards (on the right)-->
    <div class="flex flex-col gap-16">
      {#each experiences as exp, i}

        <!-- Mobile layout -->
        <div class="flex md:hidden gap-6 pl-2">

          <!-- Logo circle -->
          <div class="flex-shrink-0 w-14 h-14 rounded-full border-5 border-white/20 bg-black z-10
                       flex items-center justify-center overflow-hidden
                       ">
            {#if exp.logo}
              <img src={exp.logo} alt={exp.company} class="w-full h-full object-cover " loading="lazy" />
            {:else}
              <span class="text-lg font-bold text-blue-400">{exp.company[0]}</span>
            {/if}
          </div>

          <!-- Card -->
           <SlideIn delay={i*300}>
          <div class="flex-1 rounded-lg p-6 flex flex-col gap-4
                       bg-blue-200/[0.05] outline outline-1 outline-white/[0.15]
                       backglow mr-10 ">
            <div>
              <h3 class="text-xl font-bold text-[#f0efe9]">{exp.role}</h3>
              <p class="text-base text-blue-400 mt-0.5">{exp.company}</p>
            </div>
            <p class="text-sm leading-relaxed text-gray-500">{exp.description}</p>
            <p class="text-[0.72rem] tracking-wide uppercase text-gray-600">{exp.start} — {exp.end}</p>
            {#if exp.tech}
              <div class="flex flex-wrap gap-2">
                {#each exp.tech as tag}
                  <span class="text-[0.72rem] tracking-wide text-gray-400 bg-white/5
                               border border-white/[0.08] px-3 py-[3px] rounded-full">
                    {tag}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
          </SlideIn>
        </div>

        <!-- Desktop layout -->
        <div class="hidden md:grid md:grid-cols-2 md:gap-0 relative">
          
          <!-- Circle photo on timeline -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-20 h-20 rounded-full border-5 border-white/20 bg-black z-10
                       flex items-center justify-center overflow-hidden
                       ">
            {#if exp.logo}
              <img src={exp.logo} alt={exp.company} class="w-full h-full object-cover" loading="lazy" />
            {:else}
              <span class="text-2xl font-bold text-blue-400">{exp.company[0]}</span>
            {/if}
          </div>

          <!-- Left slot -->
          
          <div class="{i % 2 === 0 ? 'flex' : 'hidden md:flex'} justify-end pr-16">
            {#if i % 2 === 0}
            <SlideIn delay={i*300}>
              <div class="relative w-full max-w-lg rounded-lg p-8 flex flex-col gap-5
                           bg-blue-200/[0.05]  outline outline-1 outline-white/[0.15]
                           backglow ">
                <!-- Arrow -->
                <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full
                             w-16 h-5px bg-neutral-800"></div>
                  <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%-1px)]
                               w-0 h-0 border-t-10 border-b-10 border-l-10
                               border-t-transparent border-b-transparent border-l-neutral-800"></div>
                  <div class="w-10 h-1 absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%-1px)]
                               bg-neutral-800"></div>
          
                <div>
                  <h3 class="text-2xl font-bold text-[#f0efe9]">{exp.role}</h3>
                  <p class="text-lg text-blue-400 mt-1">{exp.company}</p>
                </div>
                <p class="text-base leading-relaxed text-gray-500">
                  {#each exp.description.split('- ').filter(Boolean) as line}
                    <span> - {line.trim()}</span><br>
                  {/each}
                </p>
                <p class="text-[0.72rem] tracking-wide uppercase text-gray-600">{exp.start} — {exp.end}</p>
                {#if exp.tech}
                  <div class="flex flex-wrap gap-2">
                    {#each exp.tech as tag}
                      <span class="text-[0.72rem] tracking-wide text-gray-400 bg-white/5
                                   border border-white/[0.08] px-3 py-[3px] rounded-full">
                        {tag}
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>
            </SlideIn>
            {/if}
          </div>


          <!-- Right slot -->
          <div class="{i % 2 === 1 ? 'flex' : 'hidden md:flex'} justify-start pl-16">
            {#if i % 2 === 1}
            <SlideIn delay={i*300}>
              <div class="relative w-full max-w-lg rounded-lg p-8 flex flex-col gap-5
                           bg-blue-200/[0.05] outline outline-1 outline-white/[0.15]
                           backglow ">
                <!-- Arrow -->
                <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
                             w-16 h-px bg-neutral-800"></div>
                  <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%-1px)]
                               w-0 h-0 border-t-6 border-b-6 border-r-6
                               border-t-transparent border-b-transparent border-r-neutral-800"></div>
                  <div class="w-10 h-1 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%-1px)]
                               bg-neutral-800"></div>
                <div>
                  <h3 class="text-2xl font-bold text-[#f0efe9]">{exp.role}</h3>
                  <p class="text-lg text-blue-400 mt-1">{exp.company}</p>
                </div>
                <p class="text-base leading-relaxed text-gray-500">
                  {#each exp.description.split('- ').filter(Boolean) as line}
                    <span> - {line.trim()}</span><br>
                  {/each}
                </p>
                <p class="text-[0.72rem] tracking-wide uppercase text-gray-600">{exp.start} — {exp.end}</p>
                {#if exp.tech}
                  <div class="flex flex-wrap gap-2">
                    {#each exp.tech as tag}
                      <span class="text-[0.72rem] tracking-wide text-gray-400 bg-white/5
                                   border border-white/[0.08] px-3 py-[3px] rounded-full">
                        {tag}
                      </span>
                      
                    {/each}
                  </div>
                {/if}
              </div>
              </SlideIn>
            {/if}
          </div>
          
        </div>
      {/each}
    </div>


  </div>

</section>