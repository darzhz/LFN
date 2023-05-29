<script>
	import Map from './components/Map.svelte';
	import Feed from './components/Feed.svelte';
	import Add from './components/Add.svelte';
	import Acc from './components/Acc.svelte';
	import Chat from './components/Chat.svelte';
	import InstantChat from './components/Chatbox.svelte';
	let toggle = {
		showMap:true,
		showAdd:false,
		feed:false,
		showAcc:false,
		showChat:false,
		showInstantChat:false
	}
	$:showMap = toggle['showMap'];
	$:showAdd= toggle['showAdd'];
	$:feed  = toggle['feed'];
	$:showAcc = toggle['showAcc'];
	$:showChat = toggle['showChat'];
	$:showInstantChat = toggle['showInstantChat']
	const handleViewChange = (elem) =>{
		console.log(toggle);
		let arr = Object.keys(toggle);
		arr.forEach((x) =>(toggle[x] = false))
		toggle[elem] = true;
	}
	let Iuser = null;
	let Ipid = null;
	let mylat;
	let mylong;
	const handleOpen = (event) => {
		Iuser = event.detail.username;
		Ipid = event.detail.pid
		handleViewChange('showInstantChat');
		console.log('ichat is shown');
	}
</script>
<svelte:head>
  <title>LFN</title>
 <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0" />
 <meta name="viewport" content="height=device-height, 
                      width=device-width, initial-scale=1.0, 
                      minimum-scale=1.0, maximum-scale=1.0, 
                      user-scalable=no, target-densitydpi=device-dpi">
  <meta name="theme-color" content="#BA97FB">

</svelte:head>
<main>
	{#if showMap}
	<Map bind:mylat bind:mylong/>
	{/if}
	{#if feed}
	<Feed on:close="{() =>{ toggle['feed'] = false;toggle['showMap'] = true}}" on:instantChat={handleOpen} mylat={mylat} mylong={mylong}/>
	{/if}
	{#if showAdd}
	<Add on:close="{() =>{ toggle['showAdd'] = false;toggle['showMap'] = true}}" on:loginrequired="{() => handleViewChange('showAcc')}"/>
	{/if}
	{#if showAcc}
	<Acc on:close="{() =>{ toggle['showAcc'] = false;toggle['showMap'] = true}}"/>
	{/if}
	{#if showChat}
	<Chat on:close="{() =>{ toggle['showChat'] = false;toggle['showMap'] = true}}" on:loginrequired="{() => handleViewChange('showAcc')}"/>
	{/if}
	{#if showInstantChat}
	<InstantChat chatee={Iuser} pid={Ipid} on:close="{() =>{ toggle['showInstantChat'] = false;toggle['showMap'] = true}}" on:loginrequired="{() => handleViewChange('showAcc')}"/>
	{/if}
</main>
<div id="navi">
	<div class="content">
		<ul>
			<li><a href="#" on:click="{() => handleViewChange('showChat')}">
				<span class="material-symbols-rounded">forum</span>
			</a></li>
			<li><a href="#" on:click="{() => handleViewChange('feed')}">
				<span class="material-symbols-rounded">explore</span>
			</a></li>
			<li><a href="#" on:click="{() => handleViewChange('showAdd')}">
				<span class="material-symbols-rounded">add_circle</span>
			</a></li>
			<li><a href="#" on:click="{() => handleViewChange('showMap')}">
				<span class="material-symbols-rounded">home_pin</span>
			</a></li>
			<li><a href="#" on:click="{() => handleViewChange('showAcc')}">
				<span class="material-symbols-rounded">account_circle</span>
			</a></li>
		</ul>
	</div>
</div>
<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300&display=swap');
	@font-face {
  font-family: 'Material Symbols Rounded';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/materialsymbolsrounded/v113/syl0-zNym6YjUruM-QrEh7-nyTnjDwKNJ_190FjpZIvDmUSVOK7BDJ_vb9vUSzq3wzLK-P0J-V_Zs-QtQth3-jOc7TOVpeRL2w5rwZu2rIelXxc.woff2) format('woff2');
}

.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
	:root{
	font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
	--pri:#FD136C;
	--sec:#FF3334;
	--tri:rgb(99 15 255 / 41%);;
	--quad:#fd4772;
	}
*,*::before,*::after{
	box-sizing:border-box;
}
*,h1{
	margin:0;
	padding:0;
	font-family: 'Poppins', sans-serif;
	font:inherit;
}
	:global(body){
	min-height: 100vh;
  min-height: -webkit-fill-available;
	margin: 0;
	padding: 0;
	background-color: transparent;
	background-position: center;
	background-size: cover;
}
	:global(html){
		height: -webkit-fill-available;
	}
#navi{
	background: #ffffff;
    border-radius: 15px;
    color: black;
    min-width: 320px;
    width: 95%;
    top: 91svh;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    position: fixed;
    z-index: 1000;
}
ul{

	list-style-type: none;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-evenly;
    align-items: center;
}
ul li{
	padding: 10px;
}
a{
	color: white;
	font-family: 'Poppins', sans-serif;
}
span {
	color: var(--tri);
}
@media screen and (min-width: 700px) {
	#navi{
		width: 45%;
	}
}
</style>