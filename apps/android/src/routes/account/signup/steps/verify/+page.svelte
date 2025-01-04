<script lang="ts">
  import { page } from "$app/state";
  import { Keys } from "$lib/constants";
  import { ArrowE } from "$lib/icons";
  import { store } from "$lib/store";
  import { navigateTo, useFetch } from "$lib/utils";

  let otp = $state("");
  let timeout = $state("");
  let message = $state("");
  let error = $state("");

  const email = page.url.searchParams.get("email") || "";
  const name = page.url.searchParams.get("name") || "";

  const interceptOtpInput = (
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) => {
    otp = event.currentTarget.value
      .replace(/\D/g, "")
      .replace(/(\d{1})(?=\d)/g, "$1-");
    if (otp.length === 11) {
      const syntheticEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      const form = event.currentTarget.closest("form");
      if (form) {
        form.dispatchEvent(syntheticEvent);
      }
    }
  };

  const calculateTimer = () => {
    const tempEmail = store.get<string>(Keys.TEMP_EMAIL);
    const storedTimeout = store.get<number>(Keys.TEMP_EMAIL_TIMEOUT);
    const currentTime = Date.now();

    if (tempEmail !== email || !storedTimeout) {
      const otpTimeout = currentTime + 5 * 60 * 1000; // 5 mins
      store.set(Keys.TEMP_EMAIL_TIMEOUT, otpTimeout);
      store.set(Keys.TEMP_EMAIL, email);
      timeout = "Resend in 4:59";

      return;
    }

    const timeLeft = storedTimeout - currentTime;

    if (timeLeft <= 0) {
      timeout = "";

      return;
    }

    const minutes = Math.floor(timeLeft / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    timeout = `Resend in ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    return;
  };

  const handleSubmit = async (_event: SubmitEvent) => {
    message = "";
    error = "";

    try {
      type Response = { error: string };
      const response = await useFetch<Response>(
        "POST",
        "/account/signup/steps/verify-otp",
        { email, code: otp.replace(/-/g, "") },
      );

      if (response.success) {
        store.remove(Keys.TEMP_EMAIL);
        store.remove(Keys.TEMP_EMAIL_TIMEOUT);
        navigateTo("/account/signup/steps/password", {
          params: { email, name },
        });
      } else {
        error = response.body.error;
      }
    } catch (error) {
      // TODO: Handle error
    }
  };

  const handleResend = async () => {
    message = "";
    error = "";

    try {
      const response = await useFetch("POST", "/account/security/otp/request", {
        email,
        name,
      });

      if (response.success) {
        message = "Another OTP code sent to your email";
      }
    } catch (_error) {
      // TODO: Handle error
    }

    store.remove(Keys.TEMP_EMAIL);
    store.remove(Keys.TEMP_EMAIL_TIMEOUT);
  };

  $effect(() => {
    const interval = setInterval(() => {
      calculateTimer();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="flex-1 flex flex-col">
  <div
    class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
  >
    <h1>Verify email</h1>
  </div>
  <div class="shadow-box p-[20px] uppercase w-full">
    <h2>Enter the OTP code sent to your email</h2>
  </div>
  <form class="w-full flex shadow-box uppercase" onsubmit={handleSubmit}>
    <input
      autocomplete="one-time-code"
      type="text"
      name="otp"
      class="w-full"
      bind:value={otp}
      oninput={interceptOtpInput}
      placeholder="- - - - - -"
      maxlength="11"
    />
    <input type="hidden" name="email" value={email} />
    <input type="hidden" name="name" value={name} />
    <button
      disabled={otp.length < 11}
      type="submit"
      class="active:bg-black active:text-white disabled:text-black/50 disabled:bg-transparent"
    >
      <ArrowE class="bg-transparent w-[20px] h-[20px]" />
    </button>
  </form>
  <div class="w-full flex">
    <div class="w-2/3 shadow-box p-[20px] uppercase">{timeout}</div>
    <button
      disabled={timeout !== ""}
      onclick={handleResend}
      class="w-1/3 p-[20px] active:bg-black active:text-white disabled:text-black/50 disabled:bg-transparent"
      type="button">Resend</button
    >
  </div>
  <div class="flex-1 shadow-box p-[20px]">
    <p>{message}</p>
    <p class="error">{error}</p>
  </div>
</div>
