<script lang="ts">
  import Hero from "./lib/hero.svelte"
  import NavInitial from "./lib/navbarInitial.svelte"
  import Nav from './lib/navbars.svelte';
  import LazyLoad from './lib/LazyLoad.svelte';

  let y = 0;
  let navbarcutoff = 200;
</script>

<svelte:window bind:scrollY={y}/>
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
