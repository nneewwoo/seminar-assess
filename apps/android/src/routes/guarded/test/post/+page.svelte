<script lang="ts">
  const titles = [
    "Let’s see how much you’ve learned — time for the post-test!",
    "The seminar’s done — ready to showcase what you know?",
    "Time to check your progress — let’s start the post-test!",
    "Show us what you’ve learned — take the post-test now!",
    "You’ve gained so much knowledge — let’s put it to the test!",
    "Let’s see how far you’ve come — it’s post-test time!",
    "Reflect on your learning — time for the post-test!",
    "Prove your progress — start the post-test today!",
    "The seminar’s over — now it’s your turn to shine!",
    "You’ve learned a lot — now let’s measure your success!",
  ];
</script>

<div class="shadow-box w-full h-full flex flex-col border-b">
  <div class="h-full flex shadow-box flex-col overflow-y-auto">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      <h1>{titles[Math.floor(Math.random() * titles.length)]}</h1>
    </div>
    <div class="shadow-box flex flex-col"></div>
  </div>
  <a
    href="/guarded/test/post/question?index=0"
    class="w-full active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
  >
    Start answering
  </a>
</div>
