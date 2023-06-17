<script>
	import * as L from 'leaflet/dist/leaflet.js';
  	import 'leaflet/dist/leaflet.css';
    import { onMount,onDestroy } from 'svelte';
    import { scale } from 'svelte/transition';
  	let map;
	let stamen = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
  let carto = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
  let light = 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png';
  let regular = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  export let mylat;
  export let mylong;
  let markers = [];
  let result = [];
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
onMount(async () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mylat = position.coords.latitude;
          mylong = position.coords.longitude;
          map =  createMap('map-container');
          fetchPosts(20);
        },(err) => {
           if (err.code == err.PERMISSION_DENIED){
             mylat = 9.1748;
             mylong =  76.5013;
             map = createMap('map-container');
             fetchPosts(20);
           }
        });
    }else {
      mylat = 9.1748;
      mylong =  76.5013;
      map = createMap('map-container');
      fetchPosts(20);
    }
  });
onDestroy(async () =>{
  map = null;
})

 function createMap(containerId) {
    let m = L.map(containerId).setView([mylat, mylong], 13);
    L.tileLayer(light, {
      minZoom: 0,
      maxZoom: 16,
    }).addTo(m);

    m.on('moveend', () => {
      const center = m.getCenter();
      mylat = center.lat;
      mylong = center.lng;
      fetchPosts(20); // Invoke the fetchPosts function
    });

    return m;
  }
</script>
<div in:scale out:scale>
<div id="indicator">
  <small>{Math.round(mylat * 100) / 100},{Math.round(mylong * 100) / 100}</small>
</div>
<div id="map-container" style="height: 100%; width: 100vw;position: absolute;"></div>
</div>
<style type="text/css">
  #indicator {
   position: absolute;
    z-index: 1001;
    min-width: 2px;
    top: 3vw;
    background-color: #ffffff;
    color: var(--tri);
    font-family: poppins, sans-serif;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 1px 1px #000000d1;
    right: 0;
  }
</style>