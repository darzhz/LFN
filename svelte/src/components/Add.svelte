<script>
	let title;
	let id;
	let desc;
	let selected;
	let files;
	let type;
	let lat;
	let long;
	let images = [];
	import Minimap from './Minimap.svelte';
	import { fade,fly } from 'svelte/transition';
	import { createEventDispatcher, onDestroy } from 'svelte';
	$: if (files) {
		console.log(files);

		for (const file of files) {
			console.log(`${file.name}: ${file.size} bytes`);
		}
	}
	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
	const handleMarkerSet = (event) => {
         lat = event.detail.lat;
    	 long = event.detail.lng;
  	}
	const handleSubmit = async () => {
    const formData = new FormData();
    let len = images.length<5?images.length:5;
    for (let i = 0; i < len; i++) {
      formData.append('images', images[i]);
    }

    formData.append('title', title);
    formData.append('desc',desc);
    formData.append('type',type);
    formData.append('lat',lat);
    formData.append('long',long);

    try {
      const response = await fetch('/posts/addPost', {
        method: 'POST',
        body: formData,
      });

      // Handle the server response
    } catch (error) {
      // Handle errors
    }
  };
  const useCurrentLocation = () =>{
  	if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      lat = position.coords.latitude;
      long = position.coords.longitude;
    },
    (error) => {
      console.error(error);
    }
  );
} else {
  console.error('Geolocation is not supported by this browser.');
}
  }
</script>
<div in:fly="{{ y: 100, duration: 300 }}" out:fly="{{ x: -100, duration: 300 }}">
	<button class="button-86" on:click={close}>Back</button>
	<form   on:submit|preventDefault={handleSubmit}>
		<div class="container">
  <div class="row">
    <div class="col-25"></div>
    <div class="col-75">
      <input type="text" id="fname"  bind:value={title} spellcheck="false" name="firstname" placeholder="Title">
    </div>
  </div>
  <div class="row">
    <div class="col-25"></div>
    <div class="col-75">
    <select id="type" name="type" bind:value={type}>
    <option value="LOST" selected>LOST</option>
    <option value="FOUND">FOUND</option>
  </select>
    </div>
  </div>
  <label for="many">Upload image files :</label>
<input
	bind:files={images}
	accept="image/png, image/jpeg"
	id="many"
	multiple
	type="file"
/>
  <div class="row">
    <div class="col-25"></div>
    <div class="col-75">
      <textarea id="subject" spellcheck="false"  bind:value={desc} name="subject" placeholder="description" style="height:200px"></textarea>
    </div>
  </div>
  <div id="setMap">
  <Minimap on:markerSet={handleMarkerSet} {lat} {long}/>
  <div>
  <p>Currently set :<br>lat : {lat},<br>long : {long}</p>
  <button on:click={useCurrentLocation}>Use Current GPS loaction</button>
  </div>
  </div>
  <br>
  <div class="row">
    <input type="submit" value="Submit">
  </div>
</div>
	</form>
</div>
<style>

* {
  box-sizing: border-box;
}
.row {
  width:100%;
}
#setMap{
	display: flex;
    justify-content: center;
    align-items: center;
}
input[type=text], textarea {
    width: 95%;
    padding: 14px;
    border: none;
    resize: vertical;
    outline:none;
    border-radius: 15px;
    background-color: #ffffff94;
    box-shadow: 0px 0px 6px 0px #00000075;
}
input[type=file] {
	width: 95%;
    text-align: center;
    border-radius: 13px;
}
select {
	width: 95%;
    text-align: center;
    border-radius: 15px;
    background-color: #ffffff94;
    box-shadow: 0px 0px 6px 0px #00000075;
}
input[type=submit] {
    background-color: #19c384;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 97px;
    margin-bottom: 50px;
}
button {
	background-color: #19c384;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 97px;
}
button:hover {
	 background-color: #04AA6D;
}
input[type=submit]:hover {
  background-color: #04AA6D;
}
#fname,#insta{
  text-align: center;
}
.container {
  border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.col-25 {
  margin-top: 6px;
}

.col-75 {
  margin-top: 6px;
}

@media screen and (max-width: 600px) {
  .col-25, .col-75, input[type=submit] {
    /*width: 100%;*/
    margin-top: 0;
  }
}
@media screen and (min-width: 600px) {
 input[type=text], textarea {
  	width: 50vw;
  }
  input[type=file] {
  	width:50vw;
  }
  select {
  	width: 50vw;
  }
}


</style>