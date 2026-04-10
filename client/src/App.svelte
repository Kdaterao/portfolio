<script lang="ts">
  import Bottom from './lib/bottom.svelte'
  import About from './lib/about.svelte'
  import Experience from './lib/experience.svelte'
  import Projects from './lib/projects.svelte'
  import { fullText, eyebrowText, subHeadlineText, bio, linkedin, github, resume, tags } from "./lib/configvariables";
  import { onMount } from "svelte";
  import { type SiteConfig , fetchSiteConfig} from "./lib/api"
  import Hero from "./lib/hero.svelte"
  import NavInitial from "./lib/navbarInitial.svelte"
  import Nav from './lib/navbars.svelte';


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
  <Nav />
  <NavInitial />


  <Hero />

  <!-- Lazy load About/Education section -->
   <About></About>

  
  <!-- Lazy load Projects section -->
   <Projects></Projects>

  <!-- Lazy load Experience section -->
   <Experience></Experience>


  <!-- Lazy load Bottom section -->

  <Bottom></Bottom>

</div>


</div>