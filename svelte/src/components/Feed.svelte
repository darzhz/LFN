<script>
import Card from './Card.svelte';
import { onMount } from 'svelte';
import { fade,fly } from 'svelte/transition';
import { createEventDispatcher, onDestroy } from 'svelte';
import Topbar from './Topbar.svelte';
let result = [];
let radius = 100;
export let mylat;
export let mylong;
$: radius,fetchPosts(radius);
onMount(async () => {
  //fetchPosts();
});
onMount(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mylat = position.coords.latitude;
          mylong = position.coords.longitude;
          fetchPosts(20);
        });
    }else {
      mylat = 9.1748;
      mylong =  76.5013;
      fetchPosts(20);
    }
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
<Topbar on:close={close}>Explore</Topbar>
<input type="number" name="SearchRadius" min="10" max="10000" bind:value={radius}>
</div>
{#if result.length > 0}
    {#each result as data}
		    <Card title={data.title} pid={data.pid} username={data.username} timestamp={data.timestamp*1000} type={data.type} lat={data.lat} long={data.long} distence={data.distance} desc={data.desc} images={JSON.parse(data.src)} on:instantChat/>
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
input[type=number]{
  padding: 0;
    border: none;
    border-radius: 15px;
    text-align: center;
    position: absolute;
    top: 10px;
    right: 9px;
    color: var(--tri);
    /* content: 'km'; */
    box-shadow: inset 0px 0px 5px 0px #0000004a;
}
input[type=number] ::after{
  content: 'KM';
}
</style>