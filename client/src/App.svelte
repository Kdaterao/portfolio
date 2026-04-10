<script lang="ts">
  import { fullText, eyebrowText, subHeadlineText, bio, linkedin, github, resume, tags } from "./lib/configvariables";
  import { onMount } from "svelte";
  import { type SiteConfig , fetchSiteConfig} from "./lib/api"
  import Hero from "./lib/hero.svelte"
  import NavInitial from "./lib/navbarInitial.svelte"
  import Nav from './lib/navbars.svelte';
  import LazyLoad from './lib/LazyLoad.svelte';

  let y = 0;
  let navbarcutoff = 200;

    
    let siteConfig: SiteConfig | null = null;

    async function loadSiteConfig() {
      try {
        siteConfig = await fetchSiteConfig();
        fullText.set(siteConfig?.fullText || "Hi, I'm Krish");
        eyebrowText.set(siteConfig?.eyebrowText || "Computer Science · Math");
        subHeadlineText.set(siteConfig?.subHeadlineText || "Passionate about solving hard problems");
        bio.set(siteConfig?.bio|| "");
        linkedin.set(siteConfig?.linkedin|| "");
        github.set(siteConfig?.github|| "");
        resume.set(siteConfig?.resume || "");
        tags.set(typeof (siteConfig as any).tags === 'string' ? (siteConfig as any).tags.split(',').map((t: string) => t.trim()) : siteConfig.tags || []);
      } catch (error) {
        console.error("Error loading site config:", error);
      }
    }

    onMount(() => { loadSiteConfig();});
  
</script>

<svelte:window bind:scrollY={y}/>

<div class="w-full  h-full overflow-hidden">
<div class="bg-stone-950">
  <NavInitial />
  <Nav />
  <Hero />

  <!-- Lazy load About/Education section -->
  <LazyLoad
    component={() => import('./lib/about.svelte')}
    rootMargin="100px"
  />

  
  <!-- Lazy load Projects section -->
  <LazyLoad
    component={() => import('./lib/projects.svelte')}
    rootMargin="100px"
  />

  <!-- Lazy load Experience section -->
  <LazyLoad
    component={() => import('./lib/experience.svelte')}
    rootMargin="100px"
  />

  <!-- Lazy load Bottom section -->
  <LazyLoad
    component={() => import('./lib/bottom.svelte')}
    rootMargin="100px"
  />
</div>


</div>