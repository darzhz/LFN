<script>
  import { fade,fly } from 'svelte/transition';
  export let title = "unable to fetch data from server"
  export let username = null;
  export let lat;
  export let timestamp;
  export let long;
  export let distence;
  export let pid;
  export let desc;
  export let type = "LOST";
  let post;
  let last_updated = new Date(timestamp);
  let now  = Date.now();
  function calcTimeDiff(current,previous){
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;
    let elapsed = current - previous;
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
      return  Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
      return  Math.round(elapsed / msPerYear) + ' years ago';
    }
}
let link = "https://api.dicebear.com/6.x/notionists/svg?seed="+username;
</script>
<div class="container" bind:this="{post}">
  <div class="card" in:fly="{{ y: 100, duration: 300 }}" out:fade="{{ duration: 300 }}">
    <div class="card-header">
      <!-- <img src="bannerwhite.png" alt="banner" /> -->
    </div>
    <div class="card-body">
      <h4>
        {title}{#if distence} - {Math.round(distence*100)/100}km away{/if}
      </h4>
      <p>
       {desc}
      </p>
      <div class="user">
        <img src={link} alt="user" />
        <div class="user-info">
            <h5>@{username}</h5>
          {#if type=="LOST"}
          <span class="tag tag-pink">LOST</span>
          {:else}
          <span class="tag tag-teal">FOUND</span>
          {/if}
          <small>{calcTimeDiff(now,last_updated.getTime())}</small>
          <small>{Math.round(lat * 100) / 100},{Math.round(long * 100) / 100}</small>
        </div>
      </div>
    </div>
  </div>
</div>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
* {
  box-sizing: border-box;
}
.container{
	display: flex;
	justify-content: center;
}
.card {
  margin: 10px;
  background-color: #fffffff2;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 90vw;
}
.card-header {
  width: 100%;
  height: 100px;
  background-image: url('/bannerwhite.png');
  background-size: cover;
  background-position: center;
/*  object-fit: cover;*/
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  min-height: 100px;
}

.tag {
  background: #cccccc;
  border-radius: 50px;
  font-size: 12px;
  margin: 0;
  color: #fff;
  padding: 2px 10px;
  text-transform: uppercase;
  cursor: pointer;
}
.tag-teal {
  background-color: #47bcd4;
}
.tag-pink {
  background-color: var(--pri);
}
.tag-green {
  background-color: limegreen;
}
.card-body p {
  font-size: 13px;
  margin: 0 0 40px;
}
.user {
  display: flex;
  margin-top: auto;
}

.user img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  background-color: var(--tri);
}
.user-info h5 {
  margin: 0;
}
.user-info small {
  color: #545d7a;
}
@media (min-width: 1024px) {
  .card {
    width: 50vw;
  }
}
</style>