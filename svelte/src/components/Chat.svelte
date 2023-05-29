<script>
	import Chatlist from './Chatlist.svelte';
	import Chatbox from './Chatbox.svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
	let showChatbox = false;
	let user = null;
	let pid = null;
	const dispatch = createEventDispatcher();
	const handleOpen = (event) => {
		user = event.detail.username;
		pid = event.detail.pid
		showChatbox = true;
	}
	console.log('showChatbox :'+showChatbox);
</script>
	{#if showChatbox}
	<Chatbox chatee={user} pid={pid} on:close={()=>{showChatbox = false}}/>
	{:else}
	<Chatlist on:close on:open={handleOpen} on:loginrequired/>
	{/if}	
<style>

</style>