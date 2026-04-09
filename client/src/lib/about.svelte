<script lang="ts">
    import { onMount } from "svelte";
    import FadeIn from "./fadeIn.svelte";
    import SlideIn from "./slideIn.svelte";
    import TiltCard from "./tiltCard.svelte";
    import { fetchEducations, fetchSiteConfig, fetchPhotos, getImageUrl, type Education, type SiteConfig } from "./api";
    import SlideLoader from "./SlideLoader.svelte";

    let education: Education[] = [];
    let siteConfig: SiteConfig | null = null;
    let photos: string[] = [];
    let loading = true;

    onMount(async () => {
        try {
            const [fetchedEducation, fetchedConfig, fetchedPhotos] = await Promise.all([
                fetchEducations(),
                fetchSiteConfig(),
                fetchPhotos()
            ]);

            // Convert logo keys to signed URLs for education
            const educationWithUrls = await Promise.all(
                fetchedEducation.map(async (edu) => ({
                    ...edu,
                    logo: edu.logo ? await getImageUrl(edu.logo) : ""
                }))
            );

            education = educationWithUrls;
            siteConfig = fetchedConfig;
            photos = fetchedPhotos;
          
        } catch (error) {
            console.error("Error loading about data:", error);
        } finally {
            loading = false;
        }
    });

    $: Bio = siteConfig?.bio || "I'm a Computer Science + Math student at Rutgers University, interested in Software Engineering and AI. When I'm not working, you can find me building side projects, exploring new technologies, or refining ideas into something real."
</script>

<section id="about" class="">
  <FadeIn>
    <div class="flex flex-col items-center mb-16">
      <p class="text-sm uppercase tracking-widest text-gray-400 mb-2">An introduction</p>
      <h1 class="text-white text-[4.0rem] font-bold">About Me</h1>
      <div class="mt-4 h-1 w-16 bg-blue-500 rounded-full"></div>
    </div>
  </FadeIn>

  <div class="max-w-6xl mx-auto flex flex-col gap-10">

  <!-- Bio -->
  <div class="max-w-3xl mx-auto mb-4 text-center">
    <p class=" font-serif text-gray-400 text-base md:text-lg leading-relaxed">
   {Bio}
    </p>
  </div>

  <!-- Photo gallery: horizontal row -->
  <div class=" flex  flex-wrap gap-5 justify-center">
    {#each photos as photo, i}
      <SlideLoader delay={i*200}>
        <TiltCard>
          <div class="overflow-hidden rounded-2xl aspect-[4/5] bg-white/[0.03] border border-white/[0.08]
                      w-full max-w-50 h-70 md:w-60 md:h-80 lg:w-70 lg:h-90  hover:scale-105">
            <img
              src={photo}
              alt="Photo {i + 1}"
              class="w-full h-full object-cover transition-transform duration-500 object-center"
              loading="lazy"
            />
          </div>
        </TiltCard>
      </SlideLoader>
    {/each}
  </div>

    <!-- Education card -->
    <FadeIn delay={100}>
    <div class="flex flex-row justify-center  flex-wrap ">
      <div class="gap-4">
        {#each education as edu}
          <div class="relative rounded-2xl border border-white/[0.15] bg-white/[0.03] p-3 sm:p-8 flex flex-col gap-6
                       transition-all duration-300 hover:border-blue-400 hover:shadow-xl  hover:translate-y-2 cursor-pointer
                       backglow 
                       min-h-70  w-full max-w-120 m-2 ">

            <!-- Header -->
            <div class="flex items-center gap-5">
              {#if edu.logo}
                <div class="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center flex-shrink-0">
                  <img src={edu.logo} alt={edu.school} class="w-full h-full object-contain" loading="lazy" />
                </div>
              {/if}
              <div>
                <h3 class="text-2xl font-bold text-white">{edu.school}</h3>
                {#if edu.location}
                  <p class="text-sm text-gray-400 mt-0.5">{edu.location}</p>
                {/if}
              </div>
              {#if edu.current}
                <span class="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.1em] uppercase
                             text-blue-400 bg-blue-400/[0.1] outline outline-1 outline-blue-400/[0.5]
                             px-3 py-1 rounded-full w-fit ml-auto">
                  <span class="w-[6px] h-[6px] rounded-full bg-blue-400 hidden sm:block"></span>
                  Current
                </span>
              {/if}
            </div>

            <!-- Degree -->
            <div>
              <p class="text-xl font-bold text-white">{edu.degree} in {edu.field}</p>
              {#if edu.minor}
                <p class="text-sm text-gray-400 mt-1">
                  Minor in <span class="text-white font-semibold">{edu.minor}</span>
                </p>
              {/if}
              <p class="text-sm text-gray-600 mt-2">
                {edu.start} - {edu.end}
                {#if edu.gpa}
                  <span class="mx-2">•</span>{edu.gpa}
                {/if}
              </p>
            </div>

          </div>
        {/each}
      </div>
    </div>
    </FadeIn>
  </div>
  

</section>
