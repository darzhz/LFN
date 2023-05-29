  <script>
  import { onMount } from 'svelte';
  import Topbar from './Topbar.svelte';
  import { fly,scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { isLoggedIn,user } from '../store.js'
  const dispatch = createEventDispatcher();
  let result = [];
  const fetchChat = async () =>{
  const res = await fetch('/messages/getMessageList');
  result = await res.json();
  if(result.status){
    if(result.status=="UNAUTHENTICATED"){
      dispatch('loginrequired');
    }
  }else{
      if(!$isLoggedIn){
        isLoggedIn.update((prev) => prev = true);
        const res = await fetch('/checkLogin');
        let result = await res.json();
        user.update((prev) => prev = result.user);
      }
  }
}
  function calcTimeDiff(current,previous){
    console.log(current,previous)
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;
    let elapsed = current - previous;
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' s ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' m ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' h ago';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' d ago';
    } else if (elapsed < msPerYear) {
      return  Math.round(elapsed / msPerMonth) + ' M ago';
    } else {
      return  Math.round(elapsed / msPerYear) + ' Y ago';
    }
}
  onMount(async () => {
    fetchChat();
  });
  const clickedProfile = (username,pid) =>{
    dispatch('open',{username,pid});
  }
  let link = "https://api.dicebear.com/6.x/notionists/svg?seed=";
</script>
<div class="center" in:scale out:scale>
  <Topbar on:close >Conversations</Topbar>
  <div class="contacts">
     {#if result.length > 0}
     {#each result as data}
      <div class="contact" on:click={()=>clickedProfile(data.username,data.pid)}>
        <img class="pic" src={link+data.username}/>
        <div class="badge">
          {calcTimeDiff(Date.now(),new Date(data.timestamp).getTime())}
        </div>
        <div class="name">
          {data.username}
        </div>
        <div class="message">
          {data.message}  post#{data.pid}
        </div>
      </div>
    {/each}
    {/if}
  </div>
  </div>
<style>

.pic {
  width: 4rem;
  height: 4rem;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}
.contacts {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: center;
    justify-content: center
}
.contact {
      position: relative;
    border: none;
    box-shadow: 0px 0px 9px 0px #00000096;
    border-radius: 20px;
    width: 60vw;
    margin-bottom: 1rem;
    padding-left: 5rem;
    height: 4.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.contact .pic {
  position: absolute;
    left: 7px;
    border-radius: 50%;
    background-image: linear-gradient(45deg, var(--tri), #1affff87);
}
.contact .name {
  font-weight: 500;
  margin-bottom: 0.125rem;
}
.contact .message, .contact .seen {
  font-size: 0.9rem;
 color: var(--tri);
}
.contact .badge {
    box-sizing: border-box;
    position: absolute;
    width: 5.5rem;
    height: 1.4rem;
    text-align: center;
    font-size: 0.9rem;
    padding-top: 0.125rem;
    border-radius: 1rem;
    top: -7px;
    left: 2.5rem;
    background: #0b32ff73;
    color: white;
}

.contact:last-child {
  margin: 0;
}
</style>