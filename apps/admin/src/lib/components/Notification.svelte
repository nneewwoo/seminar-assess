<script lang="ts">
  import { notification } from "$lib/store";
</script>

{#key $notification.show}
  <div class="w-full fixed shadow-box top-0 left-0 text-center text-black">
    <p
      class={`shadow-box border-r ${$notification.type === "success" ? "bg-green-500" : $notification.type === "error" ? "bg-red-500" : "bg-sky-500"}`}
    >
      {$notification.message}
    </p>
  </div>
{/key}
