<script lang="ts">
  import { db } from "$lib/localdb";
  import type { Cycle } from "$lib/types";
  import { useFetch } from "$lib/utils/fetch";

  const init = async () => {
    const response = await useFetch<Cycle>("GET", "/cycle/current");

    if (response && response.success && response.body) {
      const storedCycle = await db.cycle.orderBy(":id").first();
      if (!storedCycle) {
        await db.cycle.add(response.body);
      } else {
        if (storedCycle.id !== response.body.id) {
          await db.cycle.clear();
          await db.cycle.add(response.body);
        }
      }
    }
  };

  $effect(() => {
    init();
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>
