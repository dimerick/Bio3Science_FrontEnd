/// <reference types='@runette/leaflet-fullscreen' />
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Map, Control, DomUtil, ZoomAnimEvent, Layer, MapOptions, tileLayer, latLng, geoJSON, divIcon, Marker, Circle, circle, marker, layerGroup, Icon, LatLng, DragEndEvent, FullscreenOptions, DomEvent, TileEventHandlerFn, Bounds, LatLngBounds, LeafletMouseEvent } from 'leaflet';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  @Output() map$: EventEmitter<Map> = new EventEmitter;
  @Output() zoom$: EventEmitter<number> = new EventEmitter;
  @Input() options: MapOptions;
  @Input() layersControl = {
    baseLayers: {
      'CartoDB DarkMatter': tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' }),
      'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
      'World Imagery': tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' })
    },
    overlays: {

    }
  };

  @Input() layersControlOptions = {
    position: 'bottomright',

  };

  public map: Map;
  @Input() zoom: number;
  @Input() layers: Layer[];
  @Input() lat: number;
  @Input() lon: number;
  @Input() height: number;
  @Input() markerActive: boolean;
  public mark: Marker;
  @Input() featureCollection: Layer[];
  @Output() markerMovedEvent: EventEmitter<LatLng> = new EventEmitter;
  @Output() mapReadyEvent: EventEmitter<boolean> = new EventEmitter;
  @Output() mapZoomEndEvent: EventEmitter<ZoomAnimEvent> = new EventEmitter;
  @Output() onMapMoveEndEvent: EventEmitter<boolean> = new EventEmitter;
  @Output() onMapSizeEvent: EventEmitter<boolean> = new EventEmitter;
  @Output() searchActiveEvent: EventEmitter<string> = new EventEmitter;
  @Output() markAddedEvent: EventEmitter<Marker> = new EventEmitter;
  @Input() markerDraggable: boolean;
  public fullscreenOptions: FullscreenOptions = {
    position: 'topleft',
    pseudoFullscreen: false,
    title: {
      true: 'Exit Fullscreen',
      false: 'View Fullscreen',
    },

  };
  public hideInfoLayer = true;
  public infoLayer = null;
  public mapLayer = null;
  public initialZoom: number;
  public lastZoom: number;
  public scaleDiff: number;
  public initTop: number = 0;
  public initLeft: number = 0;
  public actTop: number = 0;
  public actLeft: number = 0;
  public boundsMap: LatLngBounds;
  public modalSearchActive = false;
  public inputSearch = '';
  @Input() searchControlActive: boolean;
  public Custom = Control.extend({

    onAdd(map: Map) {

      let container = DomUtil.get('info-layer');

      DomEvent.disableClickPropagation(container);

      return container;
    },
    onRemove(map: Map) { }
  });

  public CustomInfoMap = Control.extend({

    onAdd(map: Map) {

      let container = DomUtil.get('info-map');

      DomEvent.disableClickPropagation(container);

      return container;
    },
    onRemove(map: Map) { }
  });

  public CustomSearchMap = Control.extend({

    onAdd(map: Map) {

      let container = DomUtil.get('icon-search-map');

      DomEvent.disableClickPropagation(container);

      return container;
    },
    onRemove(map: Map) { }
  });

  constructor() {

    this.lat = 6.5;
    this.lon = -75.4;

  }

  ngOnInit() {
    this.initializeMap();



    this.options = {
      layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        opacity: 0.7,
        maxZoom: 18,
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })],
      zoom: this.zoom,
      center: latLng(this.lat, this.lon),
      zoomControl: true
    };


  }

  ngOnDestroy() {
    this.map.clearAllEventListeners;
    this.map.remove();
  };

  onMapReady(map: Map) {
    this.map = map;
    this.map$.emit(map);
    this.zoom = map.getZoom();
    this.zoom$.emit(this.zoom);

    // var geoPoint: any = {
    //   "type": "Feature",
    //   "geometry": {
    //     "type": "Point",
    //     "coordinates": [-75.53040504455568, 6.263768840495587]
    //   },
    //   "properties": {
    //     "name": "Dinagat Islands"
    //   }
    // };

    var customControl = Control.extend({

      options: {
        position: 'bottomright'
      },

      onAdd: function (map) {
        var container = DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundImage = "url(https://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)";
        container.style.backgroundSize = "40px 40px";
        container.style.width = '40px';
        container.style.height = '40px';

        container.onclick = function () {
          console.log('buttonClicked');
        }

        return container;
      }
    });







    // var puntos = geoJSON(geoPoint, {onEachFeature: this.onEachFeature}).addTo(this.map);
    // this.layersControl.overlays = {
    //   '<b>Puntos</b>': puntos
    // };

    // this.showInfoLayer();

    this.hideInfoLayer = true;

    this.closeInfoLayer();

    this.infoLayer = new this.Custom({
      position: 'topright'
    });
    this.map.addControl(this.infoLayer);

    this.mapReadyEvent.emit(true);

    this.map.addEventListener('resize', (e) => {
      console.log("cambió el tamaño del mapa");
      this.onMapSizeEvent.emit(true);
    });

    this.map.addEventListener('click', (e: LeafletMouseEvent) => {
      console.log(e);
      if (this.markerDraggable) {
        this.mark.setLatLng(e.latlng);
        this.markerMovedEvent.emit(e.latlng);
      }
    });

    this.initialZoom = map.getZoom();
    this.lastZoom = map.getZoom();

    this.initTop = this.map.getBounds().getNorth();
    this.initLeft = this.map.getBounds().getWest();

    this.actTop = this.map.getBounds().getNorth();
    this.actLeft = this.map.getBounds().getWest();

    // this.mapLayer = new this.CustomInfoMap({
    //   position: 'bottomleft'
    // });
    //this.map.addControl(this.mapLayer);

    let searchLayer = new this.CustomSearchMap({
      position: 'topleft'
    });
    if (this.searchControlActive) {
      this.map.addControl(searchLayer);
    }

    this.listenInputSearch();
    if (this.markerActive) {
      this.createMarker();
    }

  }

  onMapZoomEnd(e: ZoomAnimEvent) {
    this.zoom = e.target.getZoom();
    this.lastZoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
    this.mapZoomEndEvent.emit(e);
    this.getBounds();
  }

  onMapMoveEnd(e: any) {
    console.log(e);
    this.onMapMoveEndEvent.emit(true);
    this.getBounds();
  }

  //   onEachFeature(feature, layer) {
  //     // does this feature have a property named popupContent?
  //     var size = 15;
  //     var myIcon = divIcon({
  //       className: 'div-icon icon-red', 
  //       iconSize: [size, size], 
  //       iconAnchor: [size/2, size/2]
  //     });
  //     var punto = marker(latLng(-75.55040504455568, 6.383768840495587)).setIcon(myIcon);
  //     layer.setIcon(myIcon);
  // }



  createMarker() {

    let mark = marker([this.lat, this.lon], {
      icon: new Icon({
        iconSize: [32, 39],
        iconAnchor: [12, 39],
        iconUrl: 'assets/images/map-icon-red.png',
      }),
      draggable: this.markerDraggable,
    });
    mark.on('dragend', (e) => {
      console.log(e);
      this.markerMoved(e);
    });

    this.map.addLayer(mark);
    this.markAddedEvent.emit(mark);
    this.mark = mark;


  }

  markerMoved(e: DragEndEvent) {
    console.log("lat - long", e.target.getLatLng().lat, "-", e.target.getLatLng().lng);
    this.markerMovedEvent.emit(latLng(e.target.getLatLng().lat, e.target.getLatLng().lng));
  }

  initializeMap() {
    let map = document.getElementById("map");
    map.style.height = `${this.height}px`;
    console.log("se establecio el alto al mapa de ", `${this.height}px`);
  }

  updateMark(latLong: LatLng) {
    this.lat = latLong.lat;
    this.lon = latLong.lng;
    console.log(this.lat, this.lon);
    this.mark.setLatLng(new LatLng(this.lat, this.lon));
    this.map.setView(new LatLng(this.lat, this.lon), this.zoom);
  }

  showInfoLayer(html: string, latLong: LatLng) {




    this.map.panTo(latLong);
    this.hideInfoLayer = false;
    // let infoLayer = document.getElementById('info-layer');
    // if(this.infoLayer){
    //   this.map.removeControl(this.infoLayer);
    // }

    console.log(html);
    let element = document.getElementById('data-info-layer');
    element.innerHTML = html;

    document.getElementById("info-layer").style.display = "";


  }

  closeInfoLayer() {
    this.hideInfoLayer = true;
    document.getElementById("info-layer").style.display = "none";
    // this.map.removeControl(this.infoLayer);
    console.log('close info layer');


  }

  setScaleDiff(scaleDiff: number) {
    this.scaleDiff = scaleDiff;
  }

  getBounds() {
    this.actTop = this.map.getBounds().getNorth();
    this.actLeft = this.map.getBounds().getWest();
  }

  toggleModalSearchActive() {
    let searchBox = document.getElementById("search-box");
    searchBox.classList.remove("notification--dismissed");
    this.modalSearchActive = !this.modalSearchActive;
    // console.log(this.modalSearchActive);
  }

  listenInputSearch() {
    let input = document.getElementById("inputSearch");

    input.addEventListener("keyup", (e) => {
      // console.log(e.key);
      if (e.key == 'Enter') {
        console.log(this.inputSearch);
        this.searchActiveEvent.emit(this.inputSearch);
      }
    });
  }

}
