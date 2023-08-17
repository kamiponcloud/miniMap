<template>
  <div class="map-container">
    <div id="map"></div>
    <div class="open-btn btn" @click="openMiniMap">打开鹰眼</div>
    <div class="close-btn btn" @click="closeMniMap">关闭鹰眼</div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MiniMap from '../utils/mini-map'
export default {
  name: 'mapContainer',
  props: {
    msg: String
  },
  created() {
  },
  mounted() {
    console.log(L)
    this.map = L.map('map', {
      zoom: 13,
      zoomControl: true,
      editable: true,
    }).setView([29.592024, 106.231126], 13) // 重庆璧山区经纬度
    let baseLayer = L.tileLayer("http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
      attribution: '&copy; 高德地图',
      subdomains: "1234",
      zoom: 3
    })
    this.map.addLayer(baseLayer)

  },
  methods: {
    openMiniMap () {
      if (!this.miniMap) {
        this.miniMap = new MiniMap(this.map)
      }
    },
    closeMniMap () {
      if (this.miniMap) {
        this.miniMap.destroy()
        this.miniMap = undefined
      }
    }
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
.btn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 70px;
  height: 20px;
  line-height: 20px;
  color: white;
  text-align: center;
  cursor: pointer;
  user-select: none;
  filter: grayscale(20%);
}
.btn:hover {
  filter: contrast(150%);
}
.btn:active {
  filter: grayscale(0%) contrast(220%) drop-shadow(0 0 0.5rem);
}
.close-btn{
  top: 30px;
  left: 140px;
  background-color: red;
}
.open-btn{
  top: 30px;
  left: 50px;
  background-color: blue;
}
</style>
