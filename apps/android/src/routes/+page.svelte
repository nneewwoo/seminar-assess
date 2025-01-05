<script lang="ts">
  import { goto } from "$app/navigation";

  $effect(() => {
    goto("/guarded/init");
  });
</script>

LOADING
