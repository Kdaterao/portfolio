<script lang="ts">
  import { onMount } from "svelte";

  export let delay = 0;
  export let threshold = 0.01;
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
  style="transition-delay: {delay}ms; translate: 0 {visible ? '0px' : `${20}px`}; will-change: transform, opacity;"
  class="transition-all duration-700 ease-out"
  class:opacity-0={!visible}
  class:opacity-100={visible}
>
  <slot />
</div>