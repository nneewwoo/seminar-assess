<script lang="ts">
  import { Keys } from "$lib/constants";
  import { db } from "$lib/localdb";
  import { store } from "$lib/store";
  import { navigateTo, useFetch } from "$lib/utils";

  let { children } = $props();

  let menuOpen = $state(false);

  const handleSignout = async () => {
    const response = await useFetch("GET", "/account/signout");

    if (response.success) {
      await db.session.clear();
      await db.cycle.clear();
      store.remove(Keys.SESSION_TOKEN);

      navigateTo("/account/signin/steps/email");
    }
  };
</script>

<div class="shadow-box relative w-full h-full flex flex-col">
  {#if menuOpen}
    <div
      class="absolute top-0 left-0 border-b h-full w-full bg-[#d9dbf1]/80 border-r shadow-box"
    >
      <div class="w-full shadow-box h-[60px] flex justify-end">
        <button
          onclick={() => (menuOpen = false)}
          class="w-1/2 bg-black text-white"
          type="button">Close</button
        >
      </div>
      <div class="w-full shadow-box h-full flex justify-end">
        <div class="w-1/2 h-full">
          <button
            onclick={handleSignout}
            class="w-full active:bg-black active:text-white"
            type="button"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  {:else}
    <div
      class="absolute border-r top-0 left-0 w-full shadow-box h-[60px] flex justify-end"
    >
      <button onclick={() => (menuOpen = true)} class="w-1/2" type="button"
        >Menu</button
      >
    </div>
  {/if}
  <div class="w-full h-full pt-[60px]">
    {@render children()}
  </div>
</div>
