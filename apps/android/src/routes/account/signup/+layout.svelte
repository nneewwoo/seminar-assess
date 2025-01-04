<script lang="ts">
  import { page } from "$app/state";
  import { WEB_URL } from "$lib/constants";
  import { ArrowNE } from "$lib/icons";

  let { children } = $props();
</script>

<div class="shadow-box w-full h-full flex flex-col">
  {@render children()}
  {#if page.url.pathname !== "/account/signup/steps/done"}
    <div class="w-full flex uppercase">
      <div class="w-full h-[60px] shadow-box p-[20px]">
        <p>Terms, Conditions, and Privacy Policy</p>
      </div>
      <a
        class="p-[20px] w-fit uppercase h-[60px] shadow-box content-center"
        target="_blank"
        href={`${WEB_URL}/terms-and-privacy`}
        aria-label="Terms and Privacy link"
      >
        <ArrowNE class="bg-transparent w-[20px] h-[20px]" />
      </a>
    </div>
  {/if}
</div>
