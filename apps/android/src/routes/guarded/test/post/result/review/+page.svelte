<script lang="ts">
  import { Radio, RadioChecked } from "$lib/icons";
  let { data } = $props();
</script>

<div class="shadow-box w-full h-full flex flex-col border-b">
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
            disabled
            checked={data.question.answer === option.id}
          />
          <div class="peer-checked:bg-black flex shadow-box group">
            <div
              class={`w-fit bg-transparent group-peer-checked:text-white flex items-center justify-center p-[20px]`}
            >
              {#if data.question.answer === option.id}
                <RadioChecked
                  class="w-[20px] text-white bg-transparent h-[20px]"
                />
              {:else}
                <Radio class="w-[20px] h-[20px] bg-transparent text-black/50" />
              {/if}
            </div>
            <div
              class="bg-transparent text-black/50 group-peer-checked:text-white pl-0 p-[20px]"
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
      class="p-[20px] w-full uppercase shadow-box content-center"
      href={data.lastIndex
        ? "/guarded/test/post/result"
        : `/guarded/test/post/result/review?index=${data.index + 1}`}
      aria-label="Next Question"
    >
      {data.lastIndex ? "Done" : "Next"}
    </a>
  </div>
</div>
