<script lang="ts">
  let { children } = $props();
</script>

<div class="shadow-box w-full h-full flex flex-col">
  {@render children()}
</div>
