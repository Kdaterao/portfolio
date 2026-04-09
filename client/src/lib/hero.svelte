<script lang="ts">
  import { onMount } from "svelte";
  import { Application } from "@splinetool/runtime";
  import { fetchSiteConfig, type SiteConfig } from "./api";

  let canvasEl: HTMLCanvasElement;
  let displayedText = "";
  let cursorVisible = true;
  let loaded = false;
  let siteConfig: SiteConfig | null = null;

  let fullText = "Hi, I'm Krish";
  let eyebrowText = "Computer Science · Math";
  let subHeadlineText = "Passionate about solving hard problems";
  let tags = ["😼", ":D"];

  onMount(() => {
    // Load site config asynchronously
    loadSiteConfig();

    //----- spline animation - load lazily -----
    let observer: IntersectionObserver;
    let app: Application | null = null;

    if (canvasEl) {
      // Create observer to load Spline only when hero is visible
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !app) {
              // Load Spline only when visible
              app = new Application(canvasEl);
              app.load('https://prod.spline.design/s8F8Q8i6NnAfquOw/scene.splinecode');

              // Pause/play based on visibility
              const playObserver = new IntersectionObserver(
                (playEntries) => {
                  playEntries.forEach((playEntry) => {
                    if (app) {
                      if (playEntry.isIntersecting) {
                        app.play();
                      } else {
                        app.stop();
                      }
                    }
                  });
                },
                { threshold: 0.001 }
              );

              playObserver.observe(canvasEl);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      observer.observe(canvasEl);
    }

    //------ big text animation - optimized -----
    // Typing animation — starts after short delay for dramatic effect
    let index = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        displayedText += fullText[index];
        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
        }
      }, 120); // Slightly slower for better performance
    }, 800); // Longer delay to let page settle

    // Blinking cursor - less frequent for better performance
    const cursorInterval = setInterval(() => {
      cursorVisible = !cursorVisible;
    }, 800); // Slower blinking

    //----- clean-up -----
    return () => {

      observer.disconnect();
      clearTimeout(delay);
      clearInterval(cursorInterval);
    };
  });

  async function loadSiteConfig() {
    try {
      siteConfig = await fetchSiteConfig();
      fullText = siteConfig?.fullText || "Hi, I'm Krish";
      eyebrowText = siteConfig?.eyebrowText || "Computer Science · Math";
      subHeadlineText = siteConfig?.subHeadlineText || "Passionate about solving hard problems";
      tags = siteConfig?.tags || ["😼", ":D"];
    } catch (error) {
      console.error("Error loading site config:", error);
    }
  }</script>



<div class="relative w-screen h-screen mb-10" id="hero">
 
  <!-- 3D canvas -->
  <div class="w-full  h-fulloverflow-hidden">
  <canvas bind:this={canvasEl} class="absolute left-1/2 -translate-x-1/2 w-[1200px] h-full pointer-events-none sm:pointer-events-auto" id="canvas3d"></canvas>
    </div>

  <!-- Hero content -->
  <div class="absolute z-[1] top-1/2 left-12 -translate-y-1/2 max-w-[580px]
                  pointer-events-none animate-fade-up">
 
    <!-- Eyebrow label -->
    <p class="flex items-center gap-[0.6rem] text-[0.78rem]  uppercase text-white mb-[1.4rem]">
      <span class="inline-block w-[6px] h-[6px] rounded-full bg-blue-400 shrink-0"></span>
        {eyebrowText}
    </p>
 


    <!-- Main headline -->
    <h1 class="font-serif text-[clamp(3rem,6vw,5.5rem)] font-normal leading-[1.05]
              tracking-[-0.02em] text-[#f0efe9] mb-[1.4rem]">
        {displayedText}
      
      <span class="relative bottom-3 text-blue-400 font-thin  duration-100 pb-8 " 
                  class:opacity-0={!cursorVisible}> | </span>
    
    </h1>
 

    <!-- Sub-headline -->
    <p class="text-[clamp(0.95rem,1.5vw,1.15rem)] leading-[1.7] text-gray-400 opacity-50 mb-8 flex flex-wrap w-100">
        {subHeadlineText}
    </p>
 
    <!-- Skill tags -->
    <div class="flex flex-wrap gap-2 mb-[2.4rem]">
      {#each tags as tag}
        <span class="text-3xl tracking-[0.05em] px-[0.85rem] py-[0.3rem] rounded-full
                     border border-[#5b8bff]/30 text-[#5b8bff]/85 bg-[#5b8bff]/[0.06]">
          {tag}
        </span>
      {/each}
    </div>
 
    </div>

</div>
 