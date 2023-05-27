<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
</script>
<div class="topMenu">
	<div class="back" on:click={()=>close()}><span class="material-symbols-rounded">
arrow_back_ios
</span></div>
  <div id="title"><slot></slot></div>
</div>


<style>
	.back{
    height: 28px;
    width: 28px;
    padding-left: 10px;
    padding-top: 10px;
    color: var(--tri);
}
#title{
    position: absolute;
    width: fit-content;
    left: 0;
    top: 10px;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    font-family: poppins,sans-serif;
    color: var(--tri);
}
</style>