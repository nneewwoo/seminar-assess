<script lang="ts">
  const titles = [
    "It’s seminar time!",
    "Don’t miss out!",
    "Time to join in!",
    "Heads up!",
    "The seminar is happening!",
    "Join the crowd!",
    "Be part of the action!",
    "Let’s get started!",
    "It’s happening live!",
    "Ready to learn?",
  ];

  const descriptions = [
    "The seminar is starting now — head over and join us!",
    "Grab your seat — the seminar is live and waiting for you!",
    "The room is buzzing — don’t miss out on the action!",
    "It’s happening right now — come join the seminar in person!",
    "The doors are open — step in and experience the seminar firsthand!",
    "The seminar is live and in full swing — come and be part of it!",
    "Knowledge is unfolding — head to the seminar venue now!",
    "Don’t miss the energy — join the seminar happening right here, right now!",
    "The learning is happening live — take your seat and dive in!",
    "You’re invited to the live seminar—join us at the venue now!",
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
