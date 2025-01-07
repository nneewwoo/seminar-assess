<script lang="ts">
  let { data } = $props();
  const titlesHigh = [
    "Amazing! You’ve truly mastered the content!",
    "Great job! You’re at the top of your game!",
    "You crushed it! Your hard work paid off!",
    "Outstanding performance — you're a seminar star!",
    "Fantastic! You're more than ready for the real world!",
  ];
  const titlesMedium = [
    "Solid work! You’re making real progress!",
    "Good job! You’ve got the basics down!",
    "Well done! Keep pushing for excellence!",
    "Great effort! You’re on the right track!",
    "Nice work! Just a bit more to reach mastery!",
  ];
  const titlesLow = [
    "You’ve got room to grow — don’t stop now!",
    "Keep going! Every step is progress!",
    "You’re building a strong foundation — stay curious!",
    "Learning is a journey — keep at it!",
    "The seminar is just the start — practice makes perfect!",
  ];
</script>

<div class="shadow-box w-full h-full flex flex-col border-b">
  <div class="h-full flex shadow-box flex-col overflow-y-auto">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      {#if data.percentage >= 75}
        <h1>{titlesHigh[Math.floor(Math.random() * titlesHigh.length)]}</h1>
      {:else if data.percentage >= 50}
        <h1>{titlesMedium[Math.floor(Math.random() * titlesMedium.length)]}</h1>
      {:else}
        <h1>{titlesLow[Math.floor(Math.random() * titlesLow.length)]}</h1>
      {/if}
    </div>
    <div class="shadow-box p-[20px] uppercase w-full">
      <h2>
        Got <strong>{data.correct}</strong> of
        <strong>{data.over}</strong> questions correct
      </h2>
    </div>
  </div>
  <a
    href="/guarded/test/post/result/review?index=0"
    class="w-full active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
  >
    Review answers
  </a>
</div>
