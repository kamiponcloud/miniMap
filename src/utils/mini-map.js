import L from 'leaflet'

export default class MiniMap {
  constructor (map) {
    this.map = map
    this.minimap = undefined

    this.createMiniMapContainer()
    this.addEvent()
    this.updateLayer()
    this.updateZoom()
  }

  getLayerById (id) {
    let layer = null
    this.map.eachLayer((event) => {
      if (event instanceof L.LayerGroup && event.options.id === id) {
        layer = event
      }
    })
    return layer
  }

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
    mapContainer.appendChild(overviewMapContainer)
    const zoom = this.map.getZoom()
    const Center = this.map.getCenter()
    console.log(zoom, Center)
    this.minimap = L.map('overview-mini-map', {
      zoom: 8,
      zoomControl: false,
      attributionControl: false
    }).setView([Center.lat, Center.lng], zoom) // 重庆璧山区经纬度
    this.minimap.options.maxBoundsViscosity = 0;
    this.updatePosition()
  }

  updateLayer () {
    this.minimap.eachLayer((layer) => {
      if (layer !== this.map) {
        this.minimap.removeLayer(layer)
      }
    })
    var markers = []
    var tileLayers = []
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
  }

  updatePosition () {
    if (!this.hasMapMoveEvent) {
      this.map.on('move', this.updatePositionHandler)
      this.hasMapMoveEvent = true
    }
    var center = this.map.getCenter()
    this.minimap.setView(center, this.minimap.getZoom(), {})
  }

  updatePositionForMap () {
    var center = this.minimap.getCenter()
    // this.map.off('move', this.updatePositionHandler);
    if (this.hasMapMoveEvent) {
      this.map.off('move', this.updatePositionHandler)
      this.hasMapMoveEvent = false
    }
    this.map.setView(center, this.map.getZoom(), {})
  }

  updateZoom () {
    var zoomLevel = this.map.getZoom()
    const miniZoom = zoomLevel > 13 ? 10 : zoomLevel - 3
    this.minimap.setZoom(miniZoom < 3 ? 3 : miniZoom)
  }

  updateLayerEmit (e) {
    if (e.layer instanceof L.TileLayer) {
      this.updateLayer()
    }
  }
  addEvent () {
    this.updateLayerEmitHandler = this.updateLayerEmit.bind(this)
    this.updatePositionHandler = this.updatePosition.bind(this)
    this.updateZoomHandler = this.updateZoom.bind(this)
    this.updatePositionForMapHandler = this.updatePositionForMap.bind(this)
    this.dragstartHandler = () => {

    }

    this.map.on('layeradd', this.updateLayerEmitHandler)
    this.map.on('layerremove', this.updateLayerEmitHandler)
    // this.map.on('drag', this.updatePositionHandler)
    this.map.on('move', this.updatePositionHandler)
    this.hasMapMoveEvent = true
    this.map.on('moveend', this.updatePositionHandler)
    this.map.on('zoomend', this.updateZoomHandler)

    this.minimap.on('drag', this.updatePositionForMapHandler)
  }

  removeEvent () {
    this.map.off('layeradd', this.updateLayerEmitHandler)
    this.map.off('layerremove', this.updateLayerEmitHandler)
    // this.map.off('drag', this.updatePositionHandler)
    this.map.off('move', this.updatePositionHandler)
    this.map.off('moveend', this.updatePositionHandler)
    this.map.off('zoomend', this.updateZoomHandler)

    this.minimap.off('drag', this.updatePositionForMapHandler)
  }

  removeMiniMap () {
    const minimapDom = this.minimap.getContainer()
    this.minimap.remove()
    const parentElement = minimapDom.parentNode
    parentElement.removeChild(minimapDom)
  }

  destroy () { // 销毁
    this.removeEvent()
    this.removeMiniMap()
  }
}
