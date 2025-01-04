<script lang="ts">
  import { page } from "$app/state";
  import { ArrowE } from "$lib/icons";
  import { navigateTo, useFetch } from "$lib/utils";
  import { z } from "zod";

  let error: string | string[] = $state([]);

  const name = page.url.searchParams.get("name") || "";

  const handleSubmit = async (event: SubmitEvent) => {
    error = [];

    const formData = new FormData(event.target as HTMLFormElement);
    const email = String(formData.get("email")).toLocaleLowerCase();

    try {
      type Response = { error: string | z.ZodError | z.ZodError[] };

      const response = await useFetch<Response>(
        "POST",
        "/account/signup/steps/email",
        { email, name },
      );

      if (response.success) {
        navigateTo("/account/signup/steps/verify", { params: { email, name } });
      } else {
        const { error: e } = response.body;
        if (Array.isArray(e)) {
          e.forEach((issue) => {
            error = [...error, issue.message];
          });
        } else if (e instanceof z.ZodError) {
          error = e.message;
        } else if (typeof e === "string") {
          error = e;
        }
      }
    } catch (_error) {
      // TODO: Handle error
    }
  };
</script>

<div class="flex-1 flex flex-col">
  <div
    class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
  >
    <h1>Whats your email?</h1>
  </div>
  <div class="shadow-box p-[20px] uppercase w-full">
    <h2>Enter a valid email address</h2>
  </div>
  <form
    novalidate
    class="w-full flex shadow-box uppercase"
    onsubmit={handleSubmit}
  >
    <input
      autocomplete="email"
      type="email"
      name="email"
      class="w-full"
      placeholder="juandc@email.com"
    />
    <input type="hidden" name="name" value={name} />
    <button type="submit" class="active:bg-black active:text-white">
      <ArrowE class="bg-transparent w-[20px] h-[20px]" />
    </button>
  </form>
  <div class="flex-1 shadow-box p-[20px]">
    {#if typeof error === "string"}
      <p class="error w-full">{error}</p>
    {:else}
      {#each error as e}
        <p class="error w-full">{e}</p>
      {/each}
    {/if}
  </div>
</div>
