<script >
  export let email = "Darsh"
  export let username = "@Dev.One"
  import { fly } from 'svelte/transition';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { user,isLoggedIn } from '../store.js';
let dispatch = createEventDispatcher();
const close = () => dispatch('close');
  const logout = async () =>{
    const res = await fetch('/logout');
    let result = await res.json();
    user.update((prev) => prev = 'generic');
    isLoggedIn.update((prev) => prev = !prev);
    close();
  }
  let link = "https://api.dicebear.com/6.x/notionists/svg?seed="+username;
</script>
<div class="card" in:fly>
  <div class="img-avatar">
    <img
  src={link}
  alt="avatar"/>
  </div>
  <div class="card-text">
    <div class="portada">
    
    </div>
    <div class="title-total">   
      <div class="title" on:click={()=> logout()}>Logout</div>
      <h2> Hey!,</h2>
      <h2>{username}</h2>
  <div class="actions">
    <button><i class="far fa-heart"></i></button>
    <button><i class="far fa-envelope"></i></button>
    <button><i class="fas fa-user-friends"></i></button>
  </div></div>
 
  </div>
</div>

<style>

@import url("https://fonts.googleapis.com/css?family=Roboto:400,400i,700");
/*body {
  font-family: Roboto, sans-serif;
  margin: 0;
  height: 100vh;
  display: grid;
  align-items: center;
  justify-items: center;
  background-image: linear-gradient(to top, #96fbc4 0%, #f9f586 100%);
}*/

.card {
   background: #fff;
    border-radius: 4px;
    box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.5);
    min-width: 300px;
    max-width: 606px;
    border-radius: 25px;
    position: relative;
    width: 95vw;
}

.card h2 {
    margin: 0;
    padding: 0 1rem;
    color: var(--tri);
    font-size: xxx-large;
}

.card .title {
  padding: 1rem;
  text-align: right;
  color: gainsboro;
  font-weight: bold;
  font-size: 12px;
}
.card .actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  padding: 0.5rem 1rem;
}

.card img {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    border-radius: 50%;
}

.img-avatar {
  width: 80px;
  height: 80px;
  position: absolute;
  border-radius: 50%;
  border: 6px solid white;
  background-image: linear-gradient(-60deg, rgb(99 15 255) 0%, #9C27B0 100%);
  top: 15px;
  left: 85px;
}

.card-text {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.title-total {
  padding: 2.5em 1.5em 1.5em 1.5em;
}

path {
  fill: white;
}

.img-portada {
  width: 100%;
}

.portada {
  width: 100%;
  height: 100%;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-image: linear-gradient(45deg, var(--tri), #673AB7);
  background-position: bottom center;
  background-size: cover;
}

button {
  border: none;
  background: none;
  font-size: 24px;
  color: #8bc34a;
  cursor: pointer;
  transition: 0.5s;
}
button:hover {
  color: #4CAF50;
  transform: rotate(22deg);
}
@media screen and (max-width: 600px) {
.card {
  font-size: xx-large;
}
}

</style>