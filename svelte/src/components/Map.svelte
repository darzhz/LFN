<script>
	import * as L from 'leaflet';
  	import 'leaflet/dist/leaflet.css';
    import { onMount } from 'svelte';
  	let map;
	let stamen = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
  let carto = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
  let mylat = 51.51337312257464;
  let mylong =  -0.0899854302406311;
  let markers = [];
  let result = [];
  const fetchPosts = async (radius) =>{
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let raw = JSON.stringify({
    "lat": mylat,
    "long": mylong,
    "searchRadius": 20
  });
  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
   const res = await fetch('/posts/getPost',requestOptions);
    result = await res.json();
   // Remove existing markers
    markers.forEach(marker => marker.remove());
    markers = [];
    console.log(result);
    // Add new markers based on fetched posts
    if(result.length > 0){
    result.forEach(post => {
      const marker = L.marker([post['lat'], post['long']]).addTo(map);
      marker.bindPopup(`<b>${post['title']}</b><br>${post['desc']}`);
      markers.push(marker);
    });
  }
}
onMount(() => {
    map = createMap('map-container');
  });

  function createMap(containerId) {
    let m = L.map(containerId).setView([mylat, mylong], 13);
    L.tileLayer(carto, {
      minZoom: 0,
      maxZoom: 16,
    }).addTo(m);

    m.on('moveend', () => {
      const center = m.getCenter();
      mylat = center.lat;
      mylong = center.lng;
      fetchPosts(); // Invoke the fetchPosts function
    });

    return m;
  }
</script>

<div id="indicator">
  <small>{Math.round(mylat * 100) / 100},{Math.round(mylong * 100) / 100}</small>
</div>
<div id="map-container" style="height: 100vh; width: 100vw;"></div>

<style type="text/css">
  #indicator {
    position: absolute;
    z-index: 1001;
    left: 83vw;
    top: 1vw;
    background-color: #000000ba;
    color: white;
    font-family: poppins, sans-serif;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 1px 1px #000000d1;
  }
</style>