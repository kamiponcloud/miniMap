<template>
  <div id="app">
    <map-container/>
  </div>
</template>

<script>
import mapContainer from './components/mapContainer.vue'

export default {
  name: 'App',
  components: {
    mapContainer
  }
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  border: 0;
  width: 100%;
  height: 100%;
}
</style>
