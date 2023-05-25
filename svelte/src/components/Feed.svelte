<script>
import Card from './Card.svelte';
import { onMount } from 'svelte';
import { fade,fly } from 'svelte/transition';
import { createEventDispatcher, onDestroy } from 'svelte';
let result = [];
let radius = 100;
let mylat = 51.51337312257464;
let mylong =  -0.0899854302406311;
$: radius,fetchPosts(radius);
onMount(async () => {
  //fetchPosts();
});
const fetchPosts = async (radius) =>{
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let raw = JSON.stringify({
    "lat": mylat,
    "long": mylong,
    "searchRadius": radius
  });
  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const res = await fetch('/posts/getPost',requestOptions);
  result = await res.json();
  console.log(result);
}
const dispatch = createEventDispatcher();
const close = () => dispatch('close');
</script>

<div class="scrollwindow" in:fly="{{ y: 100, duration: 300 }}" out:fly="{{ x: -100, duration: 300 }}">
<div id="topbar">
<button class="button-86" on:click={close}>Back</button>
<input type="number" name="SearchRadius" min="10" max="5000" bind:value={radius}>
</div>
{#if result.length > 0}
    {#each result as data}
		    <Card title={data.title} username={data.username} timestamp={data.timestamp*1000} type={data.type} lat={data.lat} long={data.long} distence={data.distance} desc={data.desc}/>
    {/each}
{/if}
</div>
<style>
button{
  all: unset;
  width: 100px;
  height: 30px;
  font-size: 16px;
  background: transparent;
  border: none;
  position: relative;
  color: #f0f0f0;
  cursor: pointer;
  z-index: 1;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

}
#topbar{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>