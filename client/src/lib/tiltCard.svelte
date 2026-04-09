<script lang="ts">
  let el: HTMLDivElement;

  function handleMouseMove(e: MouseEvent) {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateX = ((y - cy) / cy) * -12;
    const rotateY = ((x - cx) / cx) * 12;

    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  }

  function handleMouseLeave() {
    el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)`;
  }
</script>

<div
  bind:this={el}
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  style="transition: transform 0.15s ease; transform-style: preserve-3d; will-change: transform;"
>
  <slot />
</div>