<script lang="ts">
import '../app.css'
let { children } = $props()
</script>

<main class="h-screen w-screen shadow-box border-r border-b select-none">
	{@render children()}
</main>
