<script lang="ts">
  import { db } from "$lib/localdb";
  import { online } from "$lib/store";
  import { useFetch } from "$lib/utils";

  let { children } = $props();

  const syncAnswers = async () => {
    const answers = await db.evaluationAnswers.toArray();
    const unsyncedAnswers = answers.filter(
      (answer) => !answer.synced && answer.answer !== "",
    );

    console.log(unsyncedAnswers);

    if (unsyncedAnswers.length > 0) {
      unsyncedAnswers.forEach(async (answer) => {
        const response = await useFetch("POST", "/evaluation/answer", answer);
        if (response.success) {
          await db.evaluationAnswers.update(answer.id, { synced: true });
        }
      });
    }
  };

  $effect(() => {
    if ($online) {
      syncAnswers();
    }
  });
</script>

{@render children()}
