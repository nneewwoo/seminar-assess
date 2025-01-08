<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import Notification from "$lib/components/Notification.svelte";
  import { notify } from "$lib/store.js";
  import { db } from "@seminar-assess/db";

  let { data, form } = $props();

  const handleSuccess = async () => {
    notify("Account created successfully", "success");
    setTimeout(() => {
      goto("/account/signin");
    }, 3000);

    await db.tempLink.delete({ where: { token: data.token } });
  };

  $effect(() => {
    if (form?.success) {
      handleSuccess();
    }
  });
</script>

<form use:enhance method="POST" class="shadow-box w-full flex flex-col">
  <div class="flex-1 flex flex-col">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      <h1>Create new admin account</h1>
    </div>
    <Notification />
    <div class="flex">
      <div class="shadow-box p-[20px] uppercase w-full">
        <h2>Email address</h2>
      </div>
      <div class="shadow-box p-[20px] uppercase w-full">
        <h2>Full name</h2>
      </div>
    </div>
    <div class="flex">
      <div class="w-full flex shadow-box uppercase">
        <input
          autocomplete="email"
          type="email"
          name="email"
          class="w-full"
          placeholder="juandc@email.com"
        />
      </div>
      <div class="w-full flex shadow-box uppercase">
        <input
          autocomplete="name"
          type="text"
          name="name"
          class="w-full"
          placeholder="Juan Dela Cruz"
        />
      </div>
    </div>
    <div class="flex">
      <div class="shadow-box p-[20px] uppercase w-full">
        <h2>Password</h2>
      </div>
      <div class="shadow-box p-[20px] uppercase w-full">
        <h2>Confirm password</h2>
      </div>
    </div>
    <div class="flex">
      <div class="w-full flex shadow-box uppercase">
        <input
          autocomplete="new-password"
          type="password"
          name="password"
          class="w-full"
          placeholder="********"
        />
      </div>
      <div class="w-full flex shadow-box uppercase">
        <input
          type="password"
          name="confirm"
          class="w-full"
          placeholder="********"
        />
      </div>
    </div>
    <div class="flex-1 shadow-box p-[20px]">
      <p class="error">{form?.error}</p>
    </div>
  </div>
  <div class="w-full flex uppercase">
    <button type="submit" class="w-full shadow-box p-[20px]"
      ><p>Create</p></button
    >
  </div>
</form>
