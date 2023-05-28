  <script>
  import { onMount } from 'svelte';
  import Topbar from './Topbar.svelte';
  import { fly } from 'svelte/transition';
   import * as animateScroll from "svelte-scrollto";
  export let pid = 10;
  export let chatee = 'roomie';
  let typed = '';
  let chat;
  let result = [];
  $: animateScroll.scrollToBottom();
  const fetchChat = async () =>{
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let raw = JSON.stringify({
    "pid": pid,
    "username": chatee
  });
  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const res = await fetch('/messages/getMessages',requestOptions);
  result = await res.json();
}
onMount(async () => {
  animateScroll.setGlobalOptions({
  offset: 200,
  container: chat,
  onStart: (element, offset) => {
    if(element) {
      console.log("Start scrolling to element:", element);
    } else if(offset) {
      console.log("Start scrolling to page offset: (${offset.x}, ${offset.y})");
    }
  }
})
  fetchChat();
});
const sendMessage = async () =>{
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let raw = JSON.stringify({
    "pid": pid,
    "username": chatee,
    "message":typed
  });
  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const res = await fetch('/messages/sendMessages',requestOptions);
  let message = await res.json();
    if(message.status == "SENT"){
      typed = '';
      result.length = 0;
      fetchChat();
    }else{
      typed = 'unable to send!';
      if(message.status == "UNAUTHENTICATED")
        dispatch('loginrequired');
    }
}
let link = "https://api.dicebear.com/6.x/notionists/svg?seed="+chatee;
setInterval(fetchChat,1000);
  </script>
  <Topbar on:close>Chat</Topbar>
  <div id="chatboxContainer" in:fly>
  <div class="chat">
    <div class="contactbar">
      <div class="pic inco">
        <img src={link}>
      </div>
      <div class="name">
        {chatee}
      </div>
    </div>
     {#if result.length > 0}
    <div class="messages" id="chat" bind:this={chat} in:fly out:fly>
      <div class="time">
        Conversation Started at {new Date(result[0].timestamp)}
      </div>
        {#each result as data}
          {#if data.type=="outgoing"}
              <div class="message out" in:fly>
               {data.content}
              </div>
          {:else}
              <div class="message inco" in:fly>
               {data.content}
              </div>
          {/if}
        {/each}
    </div>
     {/if}
    <div class="input">
     <input placeholder="Type your message here!" type="text"bind:value={typed}/><span class="material-symbols-rounded"  on:click={()=>sendMessage()} >send</span>
    </div>
  </div>
  </div>
  <style>
    @import url("https://fonts.googleapis.com/css?family=Red+Hat+Display:400,500,900&display=swap");
body, html {
  font-family: Red hat Display, sans-serif;
  font-weight: 400;
  line-height: 1.25em;
  letter-spacing: 0.025em;
  color: #333;
  background: #F7F7F7;
}
#chatboxContainer {
  margin-right: auto;
  margin-left: auto;
}

.center {
  position: absolute;
  top: 50%;
  left: calc(50% + 12rem);
  transform: translate(-50%, -50%);
}

.pic {
  width: 4rem;
  height: 4rem;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  background-image: linear-gradient(-60deg, rgb(99 15 255) 0%, #9C27B0 100%);
}
.pic img{
  border-radius: 50%;

}

.chat {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
/*    justify-content: center;*/
    width: 80vw;
/*    height: 90vh;*/
    z-index: 2;
    box-sizing: border-box;
    border-radius: 1rem;
    background: white;
    box-shadow: 0 0 8rem 0 rgba(0, 0, 0, 0.1), 0rem 2rem 4rem -3rem rgba(0, 0, 0, 0.5);
}
.chat {
  flex-basis: 3.5rem;
  flex-shrink: 0;
  margin: 1rem;
  box-sizing: border-box;
  margin-left: auto;
    margin-right: auto;
    margin-top: 2px;
}
.chat .messages {
  /*padding: 1rem; */
    width: 80vw;
    height: 57vh;
    background: #F7F7F7;
    flex-shrink: 2;
    overflow-y: auto;
    box-shadow: inset 0 2rem 2rem -2rem rgba(0, 0, 0, 0.05), inset 0 -2rem 2rem -2rem rgba(0, 0, 0, 0.05);
}
.chat .messages .time {
  font-size: 0.8rem;
  background: #EEE;
  padding: 0.25rem 1rem;
  border-radius: 2rem;
  color: #999;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  margin: 10px auto;
}
.contactbar {
    width: 22%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-bottom: 10px;
    align-content: center;
    justify-content: space-between;
}
.name {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
}
.chat .messages .message {
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  margin: 1rem;
  background: #FFF;
  border-radius: 1.125rem 1.125rem 1.125rem 0;
  min-height: 2.25rem;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  max-width: 66%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075), 0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);
}
.chat .messages .message.out {
  margin: 1rem 1rem 1rem auto;
  border-radius: 1.125rem 1.125rem 0 1.125rem;
  background: var(--tri);
  color: white;
}
.chat .messages .message .typing {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0rem;
  box-sizing: border-box;
  background: #ccc;
  border-radius: 50%;
}
.chat .input {
  box-sizing: border-box;
  flex-basis: 4rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 0.5rem 0 1.5rem;
}
.chat .input i {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #666;
  cursor: pointer;
  transition: color 200ms;
}
.chat .input i:hover {
  color: #333;
}
.chat .input input {
     border: none;
    background-image: none;
    background-color: white;
    padding: 0.5rem 1rem;
    margin-right: 0.2rem;
    border-radius: 1.125rem;
    flex-grow: 2;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1), 0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.2);
    font-family: Red hat Display, sans-serif;
    font-weight: 400;
    letter-spacing: 0.025em;
    outline: none;
    margin-bottom: 0;
}
.chat .input input:placeholder {
  color: #999;
}
@media screen and (min-width: 700px) {
  .chat{
    width: 45%;
  }
  .chat .messages{
    width: 45vw;
  }
}

  </style>
