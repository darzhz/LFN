<script>
  let username;
  let password;
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { scale } from "svelte/transition"
  import Popup from './Popup.svelte';
  import { isLoggedIn,user } from '../store.js';
  let showPopup = false;
  let dispatch = createEventDispatcher();
  const close = () => dispatch('close');
  const switchView = () => dispatch('switchView');
  const handleSubmit = async () => {
    console.log('submitted');
    let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let raw = JSON.stringify({
    "username": username,
    "password": password
  });
  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const res = await fetch('/login',requestOptions);
  let result = await res.json();
  console.log(result);
  if(result.status == "AUTHENTICATED"){
    isLoggedIn.update(prev => prev = !prev);
    user.update(prev => prev = result.user);
    dispatch('close');
  }else{
    showPopup = true;
  }
  }
</script>
<div>
  {#if showPopup}
        <div class="comp" in:scale out:scale>
          <Popup on:close={()=>{showPopup = false;}}>
            Invalid password or username please try again
          </Popup>
        </div>
      {/if}
<form class="form container" on:submit|preventDefault={handleSubmit}>
      <div class="title">Welcome</div>
      <div class="subtitle">Hey,Log in!</div>
      <div class="input-container ic1">
        <input id="firstname" class="input" type="text" placeholder=" " bind:value={username} />
        <div class="cut"></div>
        <label for="firstname" class="placeholder">Username</label>
      </div>
      <div class="input-container ic2">
        <input id="email" class="input" type="password" placeholder=" " bind:value={password}/>
        <div class="cut"></div>
        <label for="email" class="placeholder">password</label>
      </div>
      <a href="#" on:click={() => {switchView()}}>Sign up</a>
      <button type="text" class="submit">submit</button>
</form>
</div>
<style>
body {
  align-items: center;
  background-color: #000;
  display: flex;
  justify-content: center;
  height: 100dvh;
}

.form {
    background-color: var(--tri);
    border-radius: 20px;
    box-sizing: border-box;
    height: 500px;
    padding: 20px;
    width: 320px;
    backdrop-filter: blur(4px);
}

.title {
  color: #eee;
  font-family: sans-serif;
  font-size: 36px;
  font-weight: 600;
  margin-top: 30px;
}

.subtitle {
  color: #eee;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
}

.input-container {
  height: 50px;
  position: relative;
  width: 100%;
}

.ic1 {
  margin-top: 40px;
}

.ic2 {
  margin-top: 30px;
}

.input {
    background-color: #30324526;
    border-radius: 12px;
    border: 0;
    box-sizing: border-box;
    color: #eee;
    font-size: 18px;
    height: 100%;
    outline: 0;
    padding: 4px 20px 0;
    width: 100%;
}

.cut {
    background-color: white;
    border-radius: 10px;
    height: 20px;
    left: 20px;
    position: absolute;
    top: -20px;
    transform: translateY(0);
    transition: transform 200ms;
    width: 81px;
}

.cut-short {
  width: 50px;
}

.input:focus ~ .cut,
.input:not(:placeholder-shown) ~ .cut {
  transform: translateY(8px);
}

.placeholder {
  color: #65657b;
  font-family: sans-serif;
  left: 20px;
  line-height: 14px;
  pointer-events: none;
  position: absolute;
  transform-origin: 0 50%;
  transition: transform 200ms, color 200ms;
  top: 20px;
}

.input:focus ~ .placeholder,
.input:not(:placeholder-shown) ~ .placeholder {
  transform: translateY(-30px) translateX(10px) scale(0.75);
}

.input:not(:placeholder-shown) ~ .placeholder {
  color: #808097;
}

.input:focus ~ .placeholder {
  color: #dc2f55;
}

.submit {
    background-color: var(--tri);
    border-radius: 12px;
    border: 0;
    box-sizing: border-box;
    color: #eee;
    cursor: pointer;
    font-size: 18px;
    height: 50px;
    margin-top: 38px;
    outline: 0;
    text-align: center;
    width: 100%;
}

.submit:active {
  background-color: #06b;
}

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