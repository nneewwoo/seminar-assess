<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { Radio, RadioChecked } from "$lib/icons";
  import { db } from "$lib/localdb.js";
  import { online } from "$lib/store.js";
  import type { Answer } from "$lib/types.js";
  import { useFetch } from "$lib/utils/fetch.js";
  import { navigateTo } from "$lib/utils/navigation.js";
  import { get } from "svelte/store";
  import { v4 as uuidv4 } from "uuid";

  let { data } = $props();

  const { cycle } = data;

  let selected = $state("");

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const choice = formData.get("choice") as string;

    if (cycle) {
      const id = uuidv4();

      let newAnswer: Answer = {
        id,
        questionId: data.question.id,
        optionId: choice,
        for: "PRE_TEST",
        synced: false,
      };
      if (!get(online)) {
        await db.answers.add({ ...newAnswer, synced: false });
      } else {
        const response = await useFetch("POST", "/question/answer", {
          newAnswer,
        });
        if (response.success) {
          await db.answers.add({ ...newAnswer, synced: true });
        }
      }
    }

    navigateTo(
      `/guarded/test/pre/question?index=${data.index + 1}&hasSkipped=${data.hasSkipped}`,
      undefined,
    );
  };
</script>

<form
  class="shadow-box w-full h-full flex flex-col border-b"
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
    <div class="shadow-box flex flex-col">
      {#each data.question.options as option}
        <label class="group w-full">
          <input
            type="radio"
            name="choice"
            value={option.id}
            class="hidden peer"
            checked={selected === option.id}
            onchange={() => (selected = option.id)}
          />
          <div class="peer-checked:bg-black flex shadow-box group">
            <div
              class={`w-fit bg-transparent group-peer-checked:text-white flex items-center justify-center p-[20px]`}
            >
              {#if selected === option.id}
                <RadioChecked
                  class="w-[20px] text-white bg-transparent h-[20px]"
                />
              {:else}
                <Radio class="w-[20px] h-[20px] bg-transparent text-black/20" />
              {/if}
            </div>
            <div
              class="bg-transparent group-peer-checked:text-white pl-0 p-[20px]"
            >
              <div class="bg-transparent">
                <p class="uppercase bg-transparent">{option.label}</p>
              </div>
            </div>
          </div>
        </label>
      {/each}
    </div>
  </div>
  <div class="w-full flex uppercase">
    <a
      class="p-[20px] w-1/2 uppercase shadow-box content-center"
      href={`/guarded/test/pre/question?index=${data.index + 1}&hasSkipped=true`}
      aria-label="Skip Question"
    >
      Skip
    </a>
    <button
      type="submit"
      disabled={!selected}
      class="w-1/2 active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
    >
      Confirm Answer
    </button>
  </div>
</form>
