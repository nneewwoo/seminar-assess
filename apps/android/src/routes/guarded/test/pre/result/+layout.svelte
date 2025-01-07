<script lang="ts">
  import { db } from "$lib/localdb";
  import { online } from "$lib/store";
  import { useFetch } from "$lib/utils";

  let { children } = $props();

  const syncAnswers = async () => {
    const answers = await db.answers.toArray();
    const unsyncedAnswers = answers.filter((answer) => !answer.synced);

    if (unsyncedAnswers.length > 0) {
      unsyncedAnswers.forEach(async (answer) => {
        const response = await useFetch("POST", "/question/answer", {
          newAnswer: answer,
        });
        if (response.success) {
          await db.answers.update(answer.id, { synced: true });
        }
      });
    }
    if (answers.length === 0) {
      return;
    }
    const participations = await db.participation.orderBy(":id").first();
    if (participations && !participations.answeredPre) {
      const response = await useFetch("GET", "/participation/set/pretest");
      if (response.success) {
        await db.participation.update(participations.id, {
          answeredPre: true,
        });
      }
    }
  };

  $effect(() => {
    if ($online) {
      syncAnswers();
    }
  });
</script>

{@render children()}
