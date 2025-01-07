<script lang="ts">
  import { Star } from "$lib/icons/index.js";
  import { db } from "$lib/localdb.js";
  import { online } from "$lib/store.js";
  import { useFetch } from "$lib/utils/fetch.js";
  import { navigateTo } from "$lib/utils/navigation.js";
  import { get } from "svelte/store";

  let { data } = $props();

  let value = $state("");

  const { cycle } = data;

  const ratings = [
    {
      value: "Poor",
      description:
        "The experience didn’t meet expectations. There’s room for a lot of improvement.",
    },
    {
      value: "Fair",
      description:
        "The experience was okay, but there were several areas that could be better.",
    },
    {
      value: "Good",
      description:
        "The experience was solid, but there’s still some room to make it great.",
    },
    {
      value: "Better",
      description:
        "Things went well, but there are a few tweaks that could make it even better.",
    },
    {
      value: "Best",
      description:
        "Everything was perfect! I couldn’t have asked for a better experience.",
    },
  ];

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const answer = formData.get("answer") as string;

    if (cycle) {
      if (!get(online)) {
        await db.evaluationAnswers.update(data.question.id, {
          answer,
        });
      } else {
        const response = await useFetch("POST", "/evaluation/answer", {
          ...data.question,
          answer,
        });
        if (response.success) {
          await db.evaluationAnswers.update(data.question.id, {
            answer,
            synced: true,
          });
        }
      }
    }

    value = "";

    navigateTo(
      `/guarded/evaluation/question?index=${data.index + 1}&evaluationId=${data.evaluationId}`,
    );
  };

  $effect(() => {
    // TODO: Handle better
    // attach answers if already answered
    // WILL REDO
    getAnswer();
  });

  const getAnswer = async () => {
    const answer = await db.evaluationAnswers
      .where("id")
      .equals(data.question.id)
      .first();

    value = answer?.answer || "";
  };
</script>

<form
  class="shadow-box w-full h-full border-r flex flex-col border-b"
  onsubmit={handleSubmit}
>
  <div class="h-full flex shadow-box flex-col overflow-y-auto">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      <h1>
        {data.question.text}
      </h1>
    </div>
    {#if data.question.type === "RATING"}
      <div class="shadow-box flex flex-col">
        {#each ratings as star, i}
          <div class="w-full h-fit">
            <label class="flex shadow-box uppercase group p-0">
              <input
                type="radio"
                name="answer"
                value={i + 1}
                class="hidden peer"
                checked={value === String(i + 1)}
                onchange={() => (value = String(i + 1))}
              />
              <div
                class={`w-[60px] group peer-checked:bg-black peer-checked:text-white flex items-center justify-center`}
              >
                <p
                  class="uppercase text-black/20 group-peer-checked:text-white bg-transparent text-center"
                >
                  <Star class="bg-transparent h-[20px] w-[20px]" />
                </p>
              </div>
              <div
                class="bg-transparent peer-checked:text-white peer-checked:bg-black w-full p-[20px] pl-0"
              >
                <div class="bg-transparent text-start">
                  <p class="uppercase bg-transparent">
                    {star.value} –
                    <span class="normal-case">{star.description}</span>
                  </p>
                </div>
              </div>
            </label>
          </div>
        {/each}
      </div>
    {:else}
      <div class="w-full h-full py-[20px] overflow-y-hidden">
        <textarea
          placeholder="Write..."
          name="answer"
          class="px-[20px] placeholder:text-black/80 w-full h-full"
          bind:value
        ></textarea>
      </div>
    {/if}
  </div>
  <div class="w-full flex uppercase">
    <button
      type="reset"
      class="p-[20px] w-1/2 uppercase shadow-box content-center"
      onclick={() => {
        navigateTo(
          `/guarded/evaluation/question?index=${data.index + 1}&evaluationId=${data.evaluationId}`,
        );
        value = "";
      }}
      aria-label="Skip Question"
    >
      Skip
    </button>
    <button
      type="submit"
      disabled={!value}
      class="w-1/2 active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
    >
      Submit
    </button>
  </div>
</form>
