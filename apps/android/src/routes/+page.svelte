<script lang="ts">
  import { goto } from "$app/navigation";

  $effect(() => {
    goto("/guarded/init");
  });
</script>

<div class="h-full w-full shadow-box flex items-center justify-center">
  <h1 class="uppercase">Seminar Assess</h1>
</div>
