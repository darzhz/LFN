<script>
	import Map from './components/Map.svelte';
	import Feed from './components/Feed.svelte';
	import Add from './components/Add.svelte';
	let toggle = {
		showMap:true,
		showAdd:false,
		feed:false
	}
	$:showMap = toggle['showMap'];
	$:showAdd= toggle['showAdd'];
	$:feed  = toggle['feed'];
	const handleViewChange = (elem) =>{
		console.log(toggle);
		let arr = Object.keys(toggle);
		arr.forEach((x) =>(toggle[x] = false))
		toggle[elem] = true;
	}
</script>

<main>
	{#if showMap}
	<Map/>
	{/if}
	{#if feed}
	<Feed on:close="{() =>{ toggle['feed'] = false;toggle['showMap'] = true}}"/>
	{/if}
	{#if showAdd}
	<Add on:close="{() =>{ toggle['showAdd'] = false;toggle['showMap'] = true}}"/>
	{/if}
</main>
<div id="navi">
		<ul>
			<li><a href="#">Messages</a></li>
			<li><a href="#" on:click="{() => handleViewChange('feed')}">Explore</a></li>
			<li><a href="#" on:click="{() => handleViewChange('showAdd')}">Add</a></li>
			<li><a href="#" on:click="{() => handleViewChange('showMap')}">Home</a></li>
			<li><a href="#">acc</a></li>
		</ul>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300&display=swap');
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
	min-height:100dvh;
	margin: 0;
	padding: 0;
	background-color: transparent;
	background-position: center;
	background-size: cover;
}
#navi{
	background: var(--quad);
/*	box-shadow: 0px -1px 14px 0px #d54e4ed9;*/
	border-radius: 15px;
	width: 95%;
	top: 93svh;
	left: 2.5vw;
	position: fixed;
	z-index: 1000;
	background: rgba( 13, 10, 10, 0.35 );
	box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
	/*backdrop-filter: blur( 2px );
	-webkit-backdrop-filter: blur( 4px );*/
	border: 1px solid rgba( 255, 255, 255, 0.18 );
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
</style>