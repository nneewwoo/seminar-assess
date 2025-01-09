<script lang="ts">
  import { Keys } from "$lib/constants";
  import { Check, ChevronDown, ChevronUp } from "$lib/icons";
  import { db } from "$lib/localdb";
  import { online, store } from "$lib/store";
  import type { Seminar, Vote } from "$lib/types";
  import { useFetch } from "$lib/utils";
  import { error } from "@sveltejs/kit";
  import { fly, slide } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";

  let { data } = $props();

  const { cycle } = data;

  let voted = $state(false);
  let countdown = $state("");

  let seminars = $state([] as Vote[]);

  const userVoted = async () =>
    await db.votes
      .orderBy(":id")
      .toArray()
      .then((vote) => {
        vote.forEach((v) => {
          if (v.rank > 0) {
            voted = true;
            return;
          }
        });
      });

  const handleCountdown = async () => {
    const cycle = await db.cycle.orderBy(":id").first();

    if (cycle) {
      const endsAt = new Date(cycle.endsAt).getTime();

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endsAt - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance > 0) {
          if (distance < 1000 * 60 * 60 * 24) {
            countdown = `${hours}H:${minutes < 10 ? "0" : ""}${minutes}M:${seconds < 10 ? "0" : ""}${seconds}S`;
          } else if (distance < 1000 * 60 * 60) {
            countdown = `${minutes}M:${seconds < 10 ? "0" : ""}${seconds}S`;
          } else {
            countdown = `${days} days ${hours}H:${minutes < 10 ? "0" : ""}${minutes}M:${seconds < 10 ? "0" : ""}${seconds}S`;
          }
        } else {
          clearInterval(interval);
          countdown = "EXPIRED";
        }
      }, 1000);
      return;
    }
    throw error(500, { message: "An unknown error occured." });
  };

  const handleSubmit = async () => {
    console.log("Reached 1");
    seminars = seminars.map((seminar, i) => ({
      ...seminar,
      rank: i + 1,
    }));

    await db.votes.bulkUpdate(
      seminars.map((seminar, i) => ({
        key: seminar.id,
        changes: { rank: seminar.rank },
      }))
    );

    if ($online) {
      const synced = await useFetch("POST", "/seminar/vote", seminars);

      if (synced.success) {
        await db.votes.bulkUpdate(
          seminars.map((seminar) => ({
            key: seminar.id,
            changes: { synced: true },
          }))
        );
      }
    }
    await db.participation.update(cycle!.id, { voted: true });

    voted = true;
  };

  $effect(() => {
    getSeminars();
    handleCountdown();
    userVoted();
  });

  $effect(() => {
    if ($online) {
      (async () => {
        const votes = await db.votes
          .filter((vote) => !vote.synced && vote.rank > 0)
          .toArray();
        if (votes.length > 0) {
          for (const vote of votes) {
            const synced = await useFetch("POST", "/seminar/vote", {
              id: vote.id,
              cycleId: vote.cycleId,
              seminarId: vote.seminarId,
            });
            if (synced.success) {
              await db.votes.update(vote.id, { synced: true });
            }
          }
        }
      })();
    }
  });

  const getSeminars = async () => {
    const unsorted = await db.votes.orderBy(":id").toArray();
    seminars = unsorted.sort((a, b) => a.rank - b.rank);
  };

  const moveSeminarUp = async (index: number) => {
    if (index > 0) {
      const newSeminars = [...seminars];
      const temp = newSeminars[index];
      newSeminars[index] = newSeminars[index - 1];
      newSeminars[index - 1] = temp;
      seminars = newSeminars;
    }
  };

  const moveSeminarDown = async (index: number) => {
    if (index < seminars.length - 1) {
      const newSeminars = [...seminars];
      const temp = newSeminars[index];
      newSeminars[index] = newSeminars[index + 1];
      newSeminars[index + 1] = temp;
      seminars = newSeminars;
    }
  };
</script>

<div class="shadow-box w-full h-full flex flex-col border-b">
  <div class="h-full flex shadow-box flex-col overflow-y-auto">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      {#if countdown !== "EXPIRED" && !voted}
        <h1>
          What interests you the most? Rank the topics from 1 (your top choice)
          to the rest
        </h1>
      {/if}
      <h1>
        {countdown === "EXPIRED"
          ? "Voting period has ended"
          : `Voting closes in ${countdown}`}
      </h1>
    </div>
    <div class="shadow-box flex flex-col overflow-x-hidden">
      {#each seminars as seminar, i}
        <div class="group w-full">
          <div class="peer-checked:bg-black flex shadow-box group">
            <div
              class={`w-fit bg-transparent group-peer-checked:text-white flex items-center justify-center p-[20px]`}
            >
              <strong class="uppercase bg-transparent text-center">
                {i + 1}
              </strong>
            </div>
            {#key seminar.seminar.id}
              <div
                in:slide={{ axis: "y" }}
                class="truncate w-full transition transform group-peer-checked:text-white pl-0 p-[20px]"
              >
                <div class="bg-transparent">
                  <p class="uppercase bg-transparent">
                    {seminar.seminar.title}
                  </p>
                </div>
                <div class="bg-transparent">
                  <span>{seminar.seminar.description}</span>
                </div>
              </div>
            {/key}
            <div class="flex flex-col w-fit">
              <button
                type="button"
                onclick={() => moveSeminarUp(i)}
                disabled={i === 0 || voted}
                class="active:bg-black disabled:pointer-events-none disabled:text-black/50 active:text-white h-[40px] py-0 text-black"
              >
                <ChevronUp class="w-[20px] h-[20px]" />
              </button>
              <button
                type="button"
                onclick={() => moveSeminarDown(i)}
                disabled={i === seminars.length - 1 || voted}
                class="active:bg-black disabled:pointer-events-none disabled:text-black/50 active:text-white h-[40px] py-0 text-black"
              >
                <ChevronDown class="w-[20px] h-[20px]" />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <button
    type="submit"
    onclick={handleSubmit}
    disabled={voted}
    class="w-full active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
  >
    {#if voted}
      <span class="text-black/50">Awaiting results</span>
    {:else}
      Submit
    {/if}
  </button>
</div>
