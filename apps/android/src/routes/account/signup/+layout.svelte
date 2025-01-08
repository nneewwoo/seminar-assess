<script lang="ts">
  import { page } from "$app/state";
  import { WEB_URL } from "$lib/constants";
  import { ArrowNE } from "$lib/icons";
  import { open } from "@tauri-apps/plugin-shell";

  let { children } = $props();

  const openTermsPrivacy = () => {
    open(`${WEB_URL}/terms-of-service`);
  };
</script>

<div class="shadow-box w-full h-full flex flex-col">
  {@render children()}
  {#if page.url.pathname !== "/account/signup/steps/done"}
    <div class="w-full flex uppercase">
      <div class="w-full h-[60px] shadow-box p-[20px]">
        <p>Terms, Conditions, and Privacy Policy</p>
      </div>
      <button
        class="p-[20px] active:bg-black active:text-white w-fit uppercase h-[60px] shadow-box content-center"
        onclick={openTermsPrivacy}
        aria-label="Terms and Privacy link"
      >
        <ArrowNE class="bg-transparent w-[20px] h-[20px]" />
      </button>
    </div>
  {/if}
</div>
