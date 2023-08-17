<template>
  <div class="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
export default {
  name: 'mapContainer',
  props: {
    msg: String
  },
  created() {
  },
  mounted() {
    console.log(L)
    var map = L.map('map', {
      zoom: 13,
      zoomControl: true,
      editable: true,
    }).setView([29.592024, 106.231126], 13) // 重庆璧山区经纬度
    let baseLayer = L.tileLayer("http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
      attribution: '&copy; 高德地图',
      subdomains: "1234",
      zoom: 3
    })
    map.addLayer(baseLayer)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.map-container {
  width: 100%;
  height: 100%;
}
#map{
  width: 100%;
  height: 100%;
}
</style>
