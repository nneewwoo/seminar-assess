<script lang="ts">
  import { page } from "$app/state";
  import { ArrowE } from "$lib/icons";
  import { navigateTo, useFetch } from "$lib/utils";

  let showPassword = $state(false);

  let error = $state("");

  const name = page.url.searchParams.get("name") || "";
  const email = page.url.searchParams.get("email") || "";

  const handleSubmit = async (event: Event) => {
    error = "";

    const formData = new FormData(event.target as HTMLFormElement);
    const password = formData.get("password") as string;

    if (!password) {
      error = "Password is required";

      return;
    }

    if (password.length < 5) {
      error = "Password must be at least 5 characters long";

      return;
    }

    try {
      const response = await useFetch(
        "POST",
        "/account/signup/steps/password",
        { email, name, password },
      );

      if (response.success) {
        navigateTo("/account/signup/steps/done", undefined, {
          replaceState: true,
        });
      }
    } catch (error) {
      // TODO: Handle error
    }
  };
</script>

<div class="flex-1 flex flex-col">
  <div
    class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
  >
    <h1>Create a strong password</h1>
  </div>
  <div class="shadow-box p-[20px] uppercase w-full">
    <h2>Your password must be unique and hard to guess</h2>
  </div>
  <form class="w-full flex shadow-box" onsubmit={handleSubmit}>
    <input
      autocomplete="new-password"
      type={showPassword ? "text" : "password"}
      name="password"
      class="w-full"
      placeholder="********"
    />
    <input type="hidden" name="email" value={email} />
    <input type="hidden" name="name" value={name} />
    <button type="submit" class="active:bg-black active:text-white">
      <ArrowE class="bg-transparent w-[20px] h-[20px]" />
    </button>
  </form>
  <div class="flex-1 shadow-box p-[20px]">
    <p class="error">{error}</p>
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
