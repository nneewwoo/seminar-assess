<script lang="ts">
  import { Keys } from "$lib/constants";
  import Check from "$lib/icons/Check.svelte";
  import { db } from "$lib/localdb";
  import { online, store } from "$lib/store";
  import type { Seminar } from "$lib/types";
  import { useFetch } from "$lib/utils";
  import { error } from "@sveltejs/kit";
  import { v4 as uuidv4 } from "uuid";

  let voted = $state(false);
  let selectedSeminarId = $state("");
  let countdown = $state("");
  let seminars = db.seminarsSubscription;

  const userVoted = async () =>
    db.seminars
      .orderBy(":id")
      .toArray()
      .then((seminars) => {
        seminars.forEach((seminar) => {
          if (seminar.votedByUser) voted = true;
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
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance > 0) {
          countdown = `${days} days ${hours}H:${minutes < 10 ? "0" : ""}${minutes}M:${seconds < 10 ? "0" : ""}${seconds}S`;
        } else {
          clearInterval(interval);
          countdown = "EXPIRED";
        }
      }, 1000);
      return;
    }
    throw error(500, { message: "An unknown error occured1." });
  };

  const handleSubmit = async (event: SubmitEvent) => {
    const formData = new FormData(event.target as HTMLFormElement);
    const choice = formData.get("choice") as string;

    const cycle = await db.cycle.orderBy(":id").first();

    if (cycle) {
      const id = uuidv4();
      if (!$online) {
        await db.votes.clear();
        await db.votes.add({
          id,
          cycleId: cycle.id,
          seminarId: choice,
          synced: false,
        });

        await db.seminars.update(choice, {
          votedByUser: true,
        });

        await db.seminars
          .where(":id")
          .equals(choice)
          .modify((seminar) => {
            seminar.numberOfVotes = (seminar.numberOfVotes || 0) + 1;
          });
      } else {
        await useFetch("POST", "/seminar/vote", {
          id,
          cycleId: cycle.id,
          seminarId: choice,
        });
      }

      voted = true;

      return;
    }
    throw error(500, { message: "An unknown error occured2." });
  };

  $effect(() => {
    handleCountdown();
    userVoted();
  });

  $effect(() => {
    if ($online) {
      const socket = new WebSocket(
        `${import.meta.env.VITE_API_URL_WS}/seminar/vote/ws?token=${store.get(Keys.SESSION_TOKEN)}`,
      );

      socket.onopen = (_event: WebSocketEventMap["open"]) => {
        console.info("WebSocket client connected");
      };

      socket.onerror = (event: WebSocketEventMap["error"]) => {
        console.error("WebSocket error:", event);
      };

      socket.onclose = (_event: WebSocketEventMap["close"]) => {
        console.info("WebSocket client disconnected");
      };

      socket.onmessage = async (event: WebSocketEventMap["message"]) => {
        const data = JSON.parse(event.data) as { id: string } & Partial<
          Omit<Seminar, "id">
        >;
        await db.seminars.update(data.id, data);
      };

      (async () => {
        const votes = await db.votes.filter((vote) => !vote.synced).toArray();
        if (votes.length > 0) {
          for (const vote of votes) {
            await useFetch("POST", "/seminar/vote", {
              id: vote.id,
              cycleId: vote.cycleId,
              seminarId: vote.seminarId,
            });
            await db.votes.update(vote.id, { synced: true });
          }
        }
      })();

      return () => {
        socket.close();
      };
    }
  });
</script>

<form
  class="shadow-box w-full h-full flex flex-col border-b"
  onsubmit={handleSubmit}
>
  <div class="h-full flex shadow-box flex-col overflow-y-auto">
    <div
      class="w-full shadow-box uppercase min-h-[200px] p-[20px] content-center"
    >
      <h1>
        {countdown === "EXPIRED"
          ? "Voting period has ended"
          : `Voting closes in ${countdown}`}
      </h1>
    </div>
    <div class="shadow-box flex flex-col">
      {#each $seminars as seminar}
        <label class="group w-full">
          <input
            type="radio"
            name="choice"
            value={seminar.id}
            class="hidden peer"
            disabled={voted}
            checked={seminar.votedByUser}
            onchange={() => {
              selectedSeminarId = seminar.id;
            }}
          />
          <div class="peer-checked:bg-black flex shadow-box group">
            <div
              class={`w-fit bg-transparent group-peer-checked:text-white flex items-center justify-center p-[20px]`}
            >
              {#if voted}
                <div class="bg-transparent group-peer-checked:text-white">
                  <div class="bg-transparent">
                    <p class="uppercase bg-transparent text-center">
                      {seminar.numberOfVotes}
                    </p>
                  </div>
                  <div class="bg-transparent">
                    <span>votes</span>
                  </div>
                </div>
              {:else}
                <Check
                  class="w-[20px] text-transparent group-peer-checked:text-white bg-transparent h-[20px]"
                />
              {/if}
            </div>
            <div
              class="bg-transparent group-peer-checked:text-white pl-0 p-[20px]"
            >
              <div class="bg-transparent">
                <p class="uppercase bg-transparent">{seminar.title}</p>
              </div>
              <div class="bg-transparent">
                <span>{seminar.description}</span>
              </div>
            </div>
          </div>
        </label>
      {/each}
    </div>
  </div>
  <button
    type="submit"
    disabled={!selectedSeminarId}
    class="w-full active:bg-black active:text-white disabled:bg-transparent disabled:text-black/50 uppercase text-center shadow-box p-[20px]"
  >
    {#if voted}
      Awaiting results
    {:else if !selectedSeminarId}
      Pick one
    {:else}
      Cast your vote
    {/if}
  </button>
</form>
