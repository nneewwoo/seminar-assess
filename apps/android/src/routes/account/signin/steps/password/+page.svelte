<script lang="ts">
  import { page } from "$app/state";
  import { ArrowE } from "$lib/icons";
  import { db } from "$lib/localdb";
  import { store } from "$lib/store";
  import { navigateTo, useFetch } from "$lib/utils";

  let showPassword = $state(false);

  let passwordError = $state("");

  const name = page.url.searchParams.get("name") || "";
  const email = page.url.searchParams.get("email") || "";

  const handleSubmit = async (event: SubmitEvent) => {
    passwordError = "";

    const formData = new FormData(event.target as HTMLFormElement);
    const password = String(formData.get("password"));

    if (!password) {
      passwordError = "Password is required";
      return;
    }

    try {
      type Response = { error: string; token: string; id: string };

      const response = await useFetch<Response>(
        "POST",
        "/account/signin/steps/password",
        { email, password },
      );

      if (response.success) {
        const { token, id } = response.body;
        store.set("session-token", token);
        await db.session.add({ id, token });
        navigateTo("/guarded/init", undefined, { replaceState: true });
      } else {
        passwordError = response.body.error;
      }
    } catch (_error) {
      // TODO: Handle error
    }
  };
</script>

<div class="shadow-box w-full h-full flex flex-col">
  <div class="flex-1 flex flex-col uppercase">
    <div class="w-full shadow-box min-h-[200px] p-[20px] content-center">
      <h1>Welcome, {name}</h1>
    </div>
    <div class="shadow-box p-[20px] w-full">
      <h2>Enter your password</h2>
    </div>
    <form class="w-full flex shadow-box" onsubmit={handleSubmit}>
      <input
        autocomplete="current-password"
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="********"
        class="w-full"
      />
      <button type="submit" class="active:bg-black active:text-white">
        <ArrowE class="bg-transparent w-[20px] h-[20px]" />
      </button>
    </form>
    <div class="flex-1 shadow-box p-[20px]">
      <p class="error">{passwordError}</p>
    </div>
  </div>
  <div class="w-full flex uppercase">
    <div class="w-2/3 shadow-box p-[20px]">Show password?</div>
    <div class="w-1/3 grid">
      <button
        type="button"
        class={`${showPassword && "bg-black text-white"}`}
        onclick={() => (showPassword = !showPassword)}
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  </div>
</div>
