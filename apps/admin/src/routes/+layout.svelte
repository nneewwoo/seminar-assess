<script lang="ts">
  import Notification from "$lib/components/Notification.svelte";
  import "../app.css";

  let { children } = $props();
</script>

<Notification />
<main class="w-full shadow-box border-r border-b h-screen overflow-y-auto">
  {@render children()}
</main>
