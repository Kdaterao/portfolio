<script lang="ts">
  import { onMount } from 'svelte';

  export let component: () => Promise<any>;
  export let props: Record<string, any> = {};
  export let rootMargin = '100px';
  export let threshold = 0.01;

  let element: HTMLElement;
  let visible = false;
  let Component: any = null;
  let loading = false;

  onMount(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !visible && !loading) {
          loading = true;
          visible = true;

          // Load component asynchronously without blocking
          component().then((module) => {
            Component = module.default;
            loading = false;
            observer.disconnect();
          }).catch((error) => {
            console.error('Error loading component:', error);
            loading = false;
          });
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  });
</script>

<div bind:this={element}>
  {#if visible && Component}
    <svelte:component this={Component} {...props} />
  {:else if loading}
    <!-- Loading placeholder -->
    <div class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 opacity-50"></div>
    </div>
  {:else}
    <!-- Invisible placeholder to maintain layout -->
    <div class="py-20"></div>
  {/if}
</div>