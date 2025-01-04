<script lang="ts">
  import ArrowE from "$lib/icons/ArrowE.svelte";
  import { capitalize, navigateTo, useFetch } from "$lib/utils";
  import { z } from "zod";

  let error: string | string[] = $state([]);

  const handleSubmit = async (event: SubmitEvent) => {
    error = [];

    const formData = new FormData(event.target as HTMLFormElement);
    const name = capitalize(String(formData.get("name")));

    try {
      type Response = { error: z.ZodError | z.ZodError[] | string };

      const response = await useFetch<Response>(
        "POST",
        "/account/signup/steps/name",
        { name },
      );

      if (response.success) {
        navigateTo("/account/signup/steps/email", {
          params: { name },
        });
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
    <h1>Sign Up and Get Started</h1>
  </div>
  <div class="shadow-box p-[20px] uppercase w-full">
    <h2>Enter your name</h2>
  </div>
  <form class="w-full flex flex-col" onsubmit={handleSubmit}>
    <div class="flex w-full">
      <input
        autocomplete="name"
        type="text"
        class="w-full"
        name="name"
        placeholder="Juan S. Dela Cruz"
      />
      <button type="submit" class="active:bg-black active:text-white">
        <ArrowE class="bg-transparent w-[20px] h-[20px]" />
      </button>
    </div>
  </form>
  <div class="flex-1 shadow-box p-[20px]">
    {#each error as e}
      <p class="error w-full">{e}</p>
    {/each}
  </div>
</div>
