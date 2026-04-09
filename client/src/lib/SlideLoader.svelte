<script lang="ts">
  import { onMount } from "svelte";

  export let delay = 0;
  export let threshold = 0.15;
  export let y = 10;

  let el: HTMLDivElement;
  let visible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  });
</script>



<div
  bind:this={el}
  class="slide-loader {visible ? 'visible' : ''}"
  style="animation-delay: {delay}ms"
>
  <slot />
</div>

<style>
  .slide-loader {
    opacity: 0;
    transform: translateX(100%);
    will-change: transform, opacity;
    transition: opacity 220ms ease-out;
  }

  .slide-loader.visible {
    opacity: 1;
    animation: slide-in-right-overshoot 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes slide-in-right-overshoot {
    0% {
      transform: translateX(100%);
    }
    55% {
      transform: translateX(-6%);
    }
    75% {
      transform: translateX(3%);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>