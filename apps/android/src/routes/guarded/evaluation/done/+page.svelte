<script lang="ts">
  const titles = [
    "Great job!",
    "Thank you!",
    "Nice work!",
    "Awesome!",
    "Thanks!",
    "Fantastic!",
    "Well done!",
    "Excellent!",
    "Thank you again!",
    "Great!",
  ];

  const descriptions = [
    "Your feedback will help us refine and improve this topic.",
    "Your insights will help make future sessions even better.",
    "Your feedback will enhance this section for everyone.",
    "Your input is important in shaping future content.",
    "We appreciate your time in evaluating this part of the seminar.",
    "Your feedback will guide how we deliver this content.",
    "Your feedback helps us improve this area.",
    "Your input will help us improve future seminars.",
    "Your insights are key to making the next seminar better.",
    "Your feedback will help us present this topic more effectively.",
  ];
</script>

<div class="shadow-box w-full h-full flex flex-col border-b">
  <div class="h-full flex shadow-box flex-col overflow-y-auto">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      <h1>{titles[Math.floor(Math.random() * titles.length)]}</h1>
    </div>
    <div class="shadow-box p-[20px] uppercase w-full">
      <h2>{descriptions[Math.floor(Math.random() * descriptions.length)]}</h2>
    </div>
  </div>
  <a
    href="/guarded/evaluation"
    class="w-full active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
  >
    Go back
  </a>
</div>
