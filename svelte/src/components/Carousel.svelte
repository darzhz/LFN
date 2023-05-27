<script>
  import { onMount } from 'svelte';

  export let images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg'
  ];

  let currentIndex = 0;

  const showNextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
  };

  const showPreviousImage = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  };

  // onMount(() => {
  //   const interval = setInterval(showNextImage, 2000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // });
</script>

<style>
  .carousel {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .carousel img {
    width: 200px;
    height: 150px;
    object-fit: cover;
    margin: 0 10px;
  }

  .carousel-buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .carousel-buttons button {
    margin: 0 5px;
    padding: 5px 10px;
  }
</style>

<div class="carousel">
  {#each images as image, index}
    {#if index === currentIndex}
      <img src={image} alt={`Image ${index + 1}`} />
    {/if}
  {/each}

  <div class="carousel-buttons">
    <button on:click={showPreviousImage} disabled={currentIndex === 0}>Previous</button>
    <button on:click={showNextImage} disabled={currentIndex === images.length - 1}>Next</button>
  </div>
</div>