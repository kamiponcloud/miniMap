# mini-map

## 安装依赖
```
npm install
```

### 编译运行
```
npm run serve
```

> ![](https://github.com/kamiponcloud/miniMap/blob/master/public/minimap.png)

### 如何使用minimap（鹰眼）

```js
import MiniMap from '../utils/mini-map' // 引入MiniMap对象

this.map = L.map() // 创建主地图
this.miniMap = new MiniMap(this.map) // 创建小地图

this.miniMap.destroy() // 销毁
this.miniMap = undefined
```
### 如何修改minimap样式

> 在MiniMap中的`createMiniMapContainer`方法中修改样式

```js
  createMiniMapContainer () {
  var mapContainer = this.map.getContainer()
  var overviewMapContainer = L.DomUtil.create('div', 'overview-map-container')
  overviewMapContainer.id = 'overview-mini-map'
  overviewMapContainer.style.width = '200px'
  overviewMapContainer.style.height = '200px'
  overviewMapContainer.style.position = 'absolute'
  overviewMapContainer.style.right = '80px'
  overviewMapContainer.style.zIndex = 999
  overviewMapContainer.style.borderRadius = '101px'
  overviewMapContainer.style.border = '1px blue solid'
}

```
### 如何修改minimap图层跟随主地图图层的变化

> 在MiniMap中的`updateLayer`方法中修改样式
```js
this.minimap.eachLayer((layer) => {
  if (layer !== this.map) {
    this.minimap.removeLayer(layer) // 移除所有图层
  }
})

// 根据需求来改写图层变动的方法，这里只写了四种基础图层类型，
// 也可以通过其他方式做标记来实现minimap和map之间图层添加的联动

var markers = [] // 储存标记（打点）
var tileLayers = [] // 用于存储瓦片图层
var imageOverlays = [] // 用于存储图片图层
var geoJSONLayers = [] // 用于存储GeoJSON图层

this.map.eachLayer((layer) => {
  if (layer instanceof L.Marker) {
    markers.push(layer)
  } else if (layer instanceof L.TileLayer) {
    tileLayers.push(layer)
  } else if (layer instanceof L.ImageOverlay) {
    imageOverlays.push(layer)
  } else if (layer instanceof L.GeoJSON) {
    geoJSONLayers.push(layer)
  }
})
markers.forEach((marker) => {
  L.marker(marker.getLatLng(), { icon: marker.options.icon }).addTo(this.minimap);
  // 如果需要，可以对克隆的标记进行其他操作
})
tileLayers.forEach((tileLayer) => {
  L.tileLayer(tileLayer._url, tileLayer.options).addTo(this.minimap)
  // 如果需要，可以对克隆的图层进行其他操作
})
imageOverlays.forEach((imageOverlay) => {
  var bounds = imageOverlay.getBounds()
  L.imageOverlay(imageOverlay._url, bounds).addTo(this.minimap)
  // 对克隆的图片图层进行其他操作
})
geoJSONLayers.forEach((geoJSONLayer) => {
  L.geoJSON(geoJSONLayer.toGeoJSON()).addTo(this.minimap)
  // 对克隆的GeoJSON图层进行其他操作
})

```
