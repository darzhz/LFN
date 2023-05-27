<script>
	import RegisterComponent from './RegisterComponent.svelte';
	import LoginComponent from './LoginComponent.svelte';
	let showLogin = true;
	import { scale } from "svelte/transition"
</script>
<div class="container">
	{#if showLogin}
		<div class="comp" in:scale out:scale>
		<LoginComponent  on:switchView="{() => {showLogin = false}}" on:close on:LoggedIn/>
		</div>
	{:else}
		<div class="comp" in:scale out:scale>
		<RegisterComponent  on:switchView="{() => {showLogin = true}}"/>
		</div>
	{/if}
</div>

	<style>
		.container {
        display: grid;
    }

    .comp {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 2;
    }
	</style>