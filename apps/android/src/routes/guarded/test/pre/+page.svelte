<script lang="ts">
  const titles = [
    "Ready to see how much you know before the seminar?",
    "Let’s test your knowledge before the big day!",
    "How prepared are you? Let’s find out!",
    "Time to challenge yourself before the seminar!",
    "Think you’ve got this? Let’s test it!",
    "Take the pre-test and see where you stand!",
    "Show us what you already know!",
    "Warm up your brain with the pre-test!",
    "Kickstart your seminar journey with a quick test!",
    "Let’s measure your knowledge before the seminar!",
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
    href="/guarded/test/pre/question?index=0"
    class="w-full active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
  >
    Start answering
  </a>
</div>
