<script>
	import Profile from './Profile.svelte';
	import Topbar from './Topbar.svelte';
	import Card from './Card.svelte';
	import { scale } from 'svelte/transition';
	import { user } from '../store.js'
	import { onMount } from 'svelte';
	let result = [];
	const fetchPosts = async () =>{
	  const res = await fetch('/posts/getUserPost');
	  result = await res.json();
	  console.log(result);
	}
	onMount(()=>{
		fetchPosts();
	})
</script>
	<div in:scale out:scale>
	<Topbar on:close>Dashboard</Topbar>
	<div class="container" >
	<Profile username={$user} on:close/>
	</div>
	{#if result.length > 0}
    {#each result as data}
		    <Card title={data.title} username={data.username} timestamp={data.timestamp*1000} type={data.type} lat={data.lat} long={data.long} desc={data.desc}/>
    {/each}
	{/if}
	</div>
<style>
	.container{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
	}
</style>