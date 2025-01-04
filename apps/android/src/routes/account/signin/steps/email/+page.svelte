<script lang="ts">
  import { z } from "zod";
  import { navigateTo, useFetch } from "$lib/utils";
  import { ArrowE } from "$lib/icons";

  let emailError = $state("");

  const handleSubmit = async (event: SubmitEvent) => {
    emailError = "";

    const formData = new FormData(event.target as HTMLFormElement);
    const email = String(formData.get("email")).toLocaleLowerCase();

    type Response = { error: z.ZodError | string; name: string };

    try {
      const response = await useFetch<Response>(
        "POST",
        "/account/signin/steps/email",
        { email },
      );

      if (response.success) {
        navigateTo("/account/signin/steps/password", {
          params: { email, name: response.body?.name || "" },
        });
      } else {
        if (Array.isArray(response.body.error)) {
          response.body.error.forEach((e) => {
            switch (e.path[0]) {
              case "email":
                emailError = e.message;
                break;
            }
          });
        } else {
          emailError = response.body.error as string;
        }
      }
    } catch (_error) {
      // TODO: Handle error
    }
  };
</script>

<div class="shadow-box w-full h-full flex flex-col">
  <div class="flex-1 flex flex-col">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      <h1>Sign In</h1>
    </div>
    <div class="shadow-box p-[20px] uppercase w-full">
      <h2>Enter your email address</h2>
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
      <button type="submit" class="active:bg-black active:text-white">
        <ArrowE class="bg-transparent w-[20px] h-[20px]" />
      </button>
    </form>
    <div class="flex-1 shadow-box p-[20px]">
      <p class="error">{emailError}</p>
    </div>
  </div>
  <div class="w-full flex uppercase">
    <div class="w-2/3 shadow-box p-[20px]"><p>Dont have an account?</p></div>
    <div class="w-1/3 grid">
      <a href="/account/signup/steps/name"><span>Signup</span></a>
    </div>
  </div>
</div>
