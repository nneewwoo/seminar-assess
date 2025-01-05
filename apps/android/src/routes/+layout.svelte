<script lang="ts">
	import { Keys } from "$lib/constants";
	import { store } from "$lib/store";
	import { fade, fly, slide } from "svelte/transition";
	import "../app.css";

	let { children } = $props();

	let online = $state(true);

	const ononline = (_event: Event) => {
		online = true;
		store.set(Keys.ONLINE, true);
	};
	const onoffline = (_event: Event) => {
		online = false;
		store.set(Keys.ONLINE, false);
	};

	$effect(() => {
		online = window.navigator.onLine;
		store.set(Keys.ONLINE, window.navigator.onLine);
	});
</script>

<svelte:window {onload} {ononline} {onoffline} />

<main
	class="h-screen w-screen shadow-box flex flex-col select-none overscroll-none overflow-hidden"
>
	<div class="w-full shadow-box border-r uppercase">
		{#if !online}
			<p in:slide out:slide class="w-full shadow-box text-center bg-red-500">
				Offline
			</p>
		{/if}
	</div>
	<div class="h-full w-full border-r">
		{@render children()}
	</div>
</main>
