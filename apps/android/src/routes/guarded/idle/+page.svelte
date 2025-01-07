<script lang="ts">
  const titles = [
    "Hang tight",
    "Take a breather",
    "Relax for a bit",
    "Chill out",
    "Take a break",
  ];

  const descriptions = [
    "The next seminar isn’t scheduled yet, but stay tuned! We’ll have something exciting for you soon!",
    "No seminars yet, but in the meantime, keep learning and stay inspired!",
    "No seminars scheduled at the moment, but we’re working on something special for you!",
    "We’re gearing up for the next seminar. Stay patient and stay curious!",
  ];
</script>

<div class="shadow-box w-full h-full flex flex-col border-r">
  <div class="flex-1 flex flex-col">
    <div
      class="w-full uppercase shadow-box min-h-[200px] p-[20px] content-center"
    >
      <h1>{titles[Math.floor(Math.random() * titles.length)]}</h1>
    </div>
    <div class="shadow-box p-[20px] uppercase w-full">
      <h2>
        {descriptions[Math.floor(Math.random() * descriptions.length)]}
      </h2>
    </div>
    <div class="shadow-box p-[20px] flex-1 border-b uppercase w-full"></div>
  </div>
</div>
