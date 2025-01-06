<script lang="ts">
	import { online } from "$lib/store";
	import { slide } from "svelte/transition";
	import "../app.css";

	let { children } = $props();

	const ononline = (_event: Event) => {
		online.set(true);
	};
	const onoffline = (_event: Event) => {
		online.set(false);
	};

	$effect(() => {
		if (typeof window !== "undefined") {
			online.set(window.navigator.onLine);
		}
	});
</script>

<svelte:window {onload} {ononline} {onoffline} />

<main
	class="h-screen w-screen shadow-box flex flex-col select-none overscroll-none overflow-hidden"
>
	<div class="w-full shadow-box border-r uppercase">
		{#if !$online}
			<p in:slide out:slide class="w-full shadow-box text-center bg-red-500">
				Offline
			</p>
		{/if}
	</div>
	<div class="h-full w-full border-r">
		{@render children()}
	</div>
</main>
