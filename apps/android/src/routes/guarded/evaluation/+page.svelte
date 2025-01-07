<script lang="ts">
  import ArrowE from "$lib/icons/ArrowE.svelte";

  let { data } = $props();

  const titles = [
    "We’d Love to Hear Your Thoughts!",
    "Your Opinion Matters—Tell Us What You Think!",
    "Help Us Improve—Give Us Your Feedback!",
    "We’re All Ears! Share Your Seminar Experience!",
    "How Did We Do? Let Us Know!",
    "Your Feedback = Better Seminars! Share Yours!",
    "Tell Us What You Loved and What We Can Do Better!",
    "We Value Your Opinion—Let Us Know How We Can Improve!",
    "Help Us Grow! Share Your Thoughts on the Seminar!",
    "Rate Your Experience—We Want to Hear From You!",
  ];
</script>

<div class="shadow-box w-full h-full flex flex-col border-b">
  <div class="h-full flex shadow-box flex-col overflow-y-auto">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      <h1>
        {titles[Math.floor(Math.random() * titles.length)]}
      </h1>
    </div>
    <div class="shadow-box flex flex-col">
      {#each data.evaluations as evaluation}
        <div class="w-full h-fit">
          <a
            href={`/guarded/evaluation/question?index=0&evaluationId=${evaluation.id}`}
            class="h-fit flex shadow-box uppercase group p-0"
          >
            <div class="bg-transparent w-full p-[20px] pr-0">
              <div class="bg-transparent text-start">
                <p class="uppercase bg-transparent">{evaluation.title}</p>
              </div>
              <div class="bg-transparent text-start normal-case">
                <span>{evaluation.description}</span>
              </div>
            </div>
            <div
              class={`w-[60px] bg-transparent group-peer-checked:text-white flex items-center justify-center`}
            >
              <p class="uppercase bg-transparent text-center">
                <ArrowE class="bg-transparent h-[20px] w-[20px]" />
              </p>
            </div>
          </a>
        </div>
      {/each}
    </div>
  </div>
</div>
