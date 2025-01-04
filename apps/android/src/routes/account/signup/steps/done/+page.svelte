<script lang="ts">
  import { ArrowE } from "$lib/icons";
</script>

<div class="flex-1 flex flex-col">
  <div
    class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
  >
    <h1>All done!</h1>
  </div>
  <div class="shadow-box p-[20px] uppercase w-full">
    <h2>Your account is ready</h2>
  </div>
  <div class="flex-1 shadow-box p-[20px]"></div>
  <div class="w-full flex uppercase">
    <div class="w-full h-[60px] shadow-box p-[20px]">
      <p>Proceed to sign in</p>
    </div>
    <a
      class="p-[20px] w-fit uppercase h-[60px] shadow-box content-center"
      href="/account/signin/steps/email"
    >
      <ArrowE class="bg-transparent w-[20px] h-[20px]" />
    </a>
  </div>
</div>
