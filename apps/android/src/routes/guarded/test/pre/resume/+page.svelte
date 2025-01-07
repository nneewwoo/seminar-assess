<script lang="ts">
  let { data } = $props();
</script>

<div class="shadow-box w-full h-full flex flex-col border-b">
  <div class="h-full flex shadow-box flex-col overflow-y-auto">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      <h1>Welcome back! Let’s continue where you left off!</h1>
    </div>
    <div class="shadow-box p-[20px] uppercase w-full">
      <h2>
        Answered <strong>{data.answered}</strong> of
        <strong>{data.over}</strong> questions
      </h2>
    </div>
  </div>
  <a
    href="/guarded/test/pre/question?index=0&fromResume=true"
    class="w-full active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
  >
    Continue answering
  </a>
</div>
