<script lang="ts">
  let { data } = $props();
  const titlesHigh = [
    "You’re on fire! Keep the momentum going at the seminar!",
    "Great work! The seminar will polish your knowledge even further!",
    "Amazing job! You're well-prepared for the seminar!",
    "Fantastic effort! The seminar will help you go even deeper!",
    "Excellent work! The seminar will fine-tune your expertise!",
  ];
  const titlesMedium = [
    "Nice effort! The seminar will sharpen your skills!",
    "Good job! The seminar will boost your knowledge to the next level!",
    "Solid work! You'll master the material with help from the seminar!",
    "Great start! The seminar will build on what you’ve learned!",
    "Well done! The seminar will fill in the gaps and make you a pro!",
  ];
  const titlesLow = [
    "Looks like there’s room for improvement! The seminar is here to help!",
    "Keep going! The seminar will set you on the right path!",
    "Don’t worry! The seminar is the perfect place to boost your skills!",
    "The seminar is your chance to learn and grow — don’t miss it!",
    "You’ve got the foundation — now let the seminar help you build on it!",
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
    href="/guarded/test/pre/result/review?index=0"
    class="w-full active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
  >
    Review answers
  </a>
</div>
