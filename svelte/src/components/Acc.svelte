<script>
import Auth from './Auth.svelte';
import Dashboard from './Dashboard.svelte';
import Topbar from './Topbar.svelte';
import { isLoggedIn } from '../store.js';
import { createEventDispatcher, onDestroy } from 'svelte';
let dispatch = createEventDispatcher();
const close = () => dispatch('close');
</script>
{#if !$isLoggedIn}
	<Topbar on:close={close}>Authentication</Topbar>
	<div id=Auth>
		<Auth on:close={close}/>
	</div>
{:else}
		<Dashboard on:close={close}/>
{/if}

<style>
	#Auth {
	display: flex;
    justify-content: center;
    align-items: center;
	}
	.back{
    height: 28px;
    width: 28px;
    margin-left: 10px;
    margin-top: 10px;
    color: var(--tri);
}
</style>
