<script>
  import { onMount,createEventDispatcher } from 'svelte';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  let map;
  let marker;
  export let lat;
  export let long;
  const dispatch = createEventDispatcher();
  onMount(() => {
    // Initialize the map and set the view
    map = L.map(map).setView([51.505, -0.09], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
    if(lat && long)
    marker = L.marker([lat, long]).addTo(map);
    // Add click event listener to the map
    map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Remove existing marker if present
      if (marker) {
        marker.removeFrom(map);
      }

      // Add marker at the clicked location
      marker = L.marker([lat, lng]).addTo(map);
      dispatch('markerSet', { lat, lng });
    });
  });
</script>

<style>
  #map {
    height: 300px;
    width: 300px;
     box-shadow: 0px 0px 6px 0px #00000075;
     border-radius: 15px;
  }
</style>

<div id="map" bind:this={map} />