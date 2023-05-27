<script>
  import { onMount } from 'svelte';

  export let images = [];

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
<div class="carousel">
  {#if images.length > 0}
  {#each images as image, index}
    {#if index === currentIndex}
      <img src={'/images/'+image} alt={`Image ${index + 1}`} />
    {/if}
  {/each}
  {/if}

  <div class="carousel-buttons">
    <span class="material-symbols-rounded" on:click={showPreviousImage} disabled={currentIndex === 0}>arrow_back_ios</span>
    <span class="material-symbols-rounded" on:click={showNextImage} disabled={currentIndex === images.length - 1}>arrow_forward_ios</span>
  </div>
</div>
<style>
  .carousel {
    /*display: flex;
    align-items: center;
    justify-content: center;*/
  }

  .carousel img {
    width: 90vw;
    height: 200px;
    object-fit: cover;
    background-size: cover;
    background-position: center;
    position: absolute;
    border-radius: 10px;
  }

  .carousel-buttons {
   display: flex;
    justify-content: center;
    margin-top: 169px;
    position: absolute;
    left: 0;
    right: 0;
  }

  .carousel-buttons span {
    margin: 0 5px;
    padding: 5px 10px;
    color:white;
  }
</style>

