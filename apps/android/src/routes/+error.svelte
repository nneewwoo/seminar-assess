<script lang="ts">
  import { page } from "$app/state";

  const error = page.error?.message.includes("//")
    ? page.error?.message.split("//")
    : ["Oops", page.error?.message || ""];
</script>

<div class="shadow-box w-full h-full flex flex-col border-r">
  <div class="flex-1 flex flex-col">
    <div
      class="w-full uppercase shadow-box min-h-[200px] p-[20px] content-center"
    >
      <h1>{error[0]}</h1>
    </div>
    <div class="flex-1 shadow-box p-[20px] border-b">
      <span class="error"> {error[1]}</span>
    </div>
  </div>
</div>
