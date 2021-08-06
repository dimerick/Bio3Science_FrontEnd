import { Component, OnInit, ViewChild } from '@angular/core';
import { circle, Icon, LatLng, Layer, marker, Marker, point, Point, Polyline, polyline, DivIcon, DomEvent, latLng, svgOverlay, SVGOverlay, LatLngBounds, icon, divIcon, Map, ZoomAnimEvent, canvas, svg, SVG, layerGroup, LayerGroup, DomUtil, map } from 'leaflet';
import { Enlace } from 'src/app/models/enlace';
import { LayerMap } from 'src/app/models/LayerMap';
import { Search } from 'src/app/models/search';
import { ProjectService } from 'src/app/services/project.service';
import { UniversityService } from 'src/app/services/university.service';
import Swal from 'sweetalert2';
import { MapComponent } from '../map/map.component';






@Component({
  selector: 'app-project-network',
  templateUrl: './project-network.component.html',
  styleUrls: ['./project-network.component.css'],
  providers: [ProjectService]
})
export class ProjectNetworkComponent implements OnInit {

  public lat: number;
  public lon: number;
  public finishedGetLocation: boolean;
  public layers: Layer[] = [];
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  public enlaces: Enlace[] = [];
  public enlacesMap = new LayerGroup();
  public markCanvas: Marker;
  public groundZoom: number;
  public lastZoom: number;
  public lastTopLeftlatLng: LatLng;
  public initTopLeftlatLng: LatLng;
  public shift: Point;
  public svg: any;
  public g: any;
  public lockUpdateEnlances = false;
  public initZoom: number = 15;
  public colorU = '#03a7e5';
  public colorC = '#63bb8c';
  public nodesGroup: LayerGroup;
  public initAreaMap: number;

  public canvasIconClean = divIcon({
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, 0],
    html: '',
    className: 'canvas-project-network'
  });

  constructor(
    private projectService: ProjectService
  ) {
    this.lat = 200;
    this.lon = 200;

    // this.getProjects();


  }

  ngOnInit(): void {
    this.getLocation();
    // this.layers =
    //   [
    //     circle([6.15, -75.64], { radius: 10000 })
    //   ]


  }

  getLocation() {

    if ("geolocation" in navigator) {
      try {
        console.log("location detected");
        navigator.geolocation.getCurrentPosition(position => {

          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;


        });

      } catch (err) {
        console.log(err);

      } finally {
        console.log("this.lat", this.lat);
        console.log("this.lon", this.lon);
        this.lat = 39.952583;
        this.lon = -75.165222;
      }

    } else {
      this.lat = 39.952583;
      this.lon = -75.165222;

    }


  }

  markerMoved(e: LatLng) {
    console.log(e);
  }

  mapReady(e: boolean) {
    this.getProjectNetwork();
    this.getNodes();
  }

  getProjects() {
    this.projectService.getProjects().subscribe(resp => {
      console.log(resp);
    },
      (err) => {
        console.log(err);
      }
    );
  }

  getProjectNetwork() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Loading Network...',

    });

    Swal.showLoading();
    this.projectService.getProjectNetwork().subscribe(resp => {

      resp.forEach(uni => {

        uni.projects.forEach(project => {

          project.aristas.forEach(arista => {

            let enl: Enlace = {
              id: project.id,
              name: project.name,
              description: project.description,
              createdAt: project.created_at,
              initPoint: latLng([uni.lat, uni.long]),
              endPoint: latLng([arista.assoc_lat, arista.assoc_long]),
              type: arista.type,
              priority: arista.rn,
              nameEntities: uni.name + ` <i class="fa fa-arrows-h" aria-hidden="true" title="Avatar"></i> ` + arista.assoc_name,
              createdBy: project.created_by,
              nameUser: `<i class="fa fa-user" aria-hidden="true" title="User"></i> ` + project.user_name + ' ' + project.user_last_name
            };

            this.enlaces.push(enl);

          });

        });

      });

      this.drawEnlaces();
      Swal.close();
    },
      (err) => {
        console.log(err);
      });
  }

  getProjectNetworkBySearch(inputSearch: string, startDate: string, endDate: string) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Loading Network...',

    });

    Swal.showLoading();
    this.projectService.getProjectNetworkBySearch(inputSearch, startDate, endDate).subscribe(resp => {
      this.enlaces = [];
      console.log(resp.length);
      if(resp.length == 0){
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'There are no results...'
    
        });
        
      }else{

        resp.forEach(uni => {

          uni.projects.forEach(project => {
  
            project.aristas.forEach(arista => {
  
              let enl: Enlace = {
                id: project.id,
                name: project.name,
                description: project.description,
                createdAt: project.created_at,
                initPoint: latLng([uni.lat, uni.long]),
                endPoint: latLng([arista.assoc_lat, arista.assoc_long]),
                type: arista.type,
                priority: arista.rn,
                nameEntities: uni.name + ` <i class="fa fa-arrows-h" aria-hidden="true" title="Avatar"></i> ` + arista.assoc_name,
                createdBy: project.created_by,
                nameUser: `<i class="fa fa-user" aria-hidden="true" title="User"></i> ` + project.user_name + ' ' + project.user_last_name
  
              };
  
              this.enlaces.push(enl);
  
            });
  
          });
  
        });
  
        this.drawEnlaces();
        Swal.close();

      }
      
    },
      (err) => {
        console.log(err);
      });
  }

  getNodes() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Loading Nodes...',

    });

    Swal.showLoading();
    this.projectService.getNodes().subscribe(resp => {
      console.log(resp);
      resp.universities.forEach(e => {
        console.log(e);

        let myIcon = new DivIcon({
          className: 'div-icon color1',
          iconSize: [e.points, e.points],
          iconAnchor: [e.points / 2, e.points / 2]

        });

        let myIconSelected = new DivIcon({
          className: 'div-icon color3',
          iconSize: [e.points, e.points],
          iconAnchor: [e.points / 2, e.points / 2]

        });

        let mark = marker([e.lat, e.long], {
          icon: myIcon,
        });//.bindPopup(e.name);

        let layerMap: LayerMap = {
          id: e.id,
          name: e.name,
          layer: mark
        }

        this.layers.push(mark);

        mark.addEventListener('click', (layer) => {
          console.log(e);
          this.mapComponent.showInfoLayer(`
          <div class="row">
                                <div class="col-md-12">
                                    <div class="">
                                    <i class="fa fa-university fa-2x" aria-hidden="true" title="University"></i>
                                        <h5>${e.name}</h5>
                                        
                                    </div>
                                    <!--end feature-->
                                </div>                               
          
          `, latLng(e.lat, e.long));
        }, e);

      });

      resp.communities.forEach(e => {
        console.log(e);

        let myIcon = new DivIcon({
          className: 'div-icon color2',
          iconSize: [e.points, e.points],
          iconAnchor: [e.points / 2, e.points / 2]

        });

        let mark = marker([e.lat, e.long], {
          icon: myIcon
        });//.bindPopup(`<span hidden>${e.id}</span>${e.name}`);

        this.layers.push(mark);


        mark.addEventListener('click', (layer) => {
          console.log(e);
          this.mapComponent.showInfoLayer(`
          <div class="row">
                                <div class="col-md-12">
                                    <div class="">
                                    
                                    <i class="fa fa-users fa-2x" aria-hidden="true" title="Community"></i>
                                        <h5>${e.name}</h5>
                                        
                                    </div>
                                    <!--end feature-->
                                </div>                               
          
          `, latLng(e.lat, e.long));
        }, e);

      });

      Swal.close();

    },
      (err) => {
        console.log(err);
      });
  }

  getNodesBySearch(inputSearch: string, startDate, endDate) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Loading Nodes...',

    });

    Swal.showLoading();
    this.projectService.getNodesBySearch(inputSearch, startDate, endDate).subscribe(resp => {
      this.layers = [];
      resp.universities.forEach(e => {
        console.log(e);

        let myIcon = new DivIcon({
          className: 'div-icon color1',
          iconSize: [e.points, e.points],
          iconAnchor: [e.points / 2, e.points / 2]

        });

        let myIconSelected = new DivIcon({
          className: 'div-icon color3',
          iconSize: [e.points, e.points],
          iconAnchor: [e.points / 2, e.points / 2]

        });

        let mark = marker([e.lat, e.long], {
          icon: myIcon,
        });//.bindPopup(e.name);

        let layerMap: LayerMap = {
          id: e.id,
          name: e.name,
          layer: mark
        }

        console.log(mark);

        this.layers.push(mark);



        mark.addEventListener('click', (layer) => {
          console.log(e);
          this.mapComponent.showInfoLayer(`
          <div class="row">
                                <div class="col-md-12">
                                    <div class="">
                                    <i class="fa fa-university fa-2x" aria-hidden="true" title="University"></i>
                                        <h5>${e.name}</h5>
                                        
                                    </div>
                                    <!--end feature-->
                                </div>                               
          
          `, latLng(e.lat, e.long));
        }, e);

      });

      resp.communities.forEach(e => {
        console.log(e);

        let myIcon = new DivIcon({
          className: 'div-icon color2',
          iconSize: [e.points, e.points],
          iconAnchor: [e.points / 2, e.points / 2]

        });

        let mark = marker([e.lat, e.long], {
          icon: myIcon
        });//.bindPopup(`<span hidden>${e.id}</span>${e.name}`);

        this.layers.push(mark);


        mark.addEventListener('click', (layer) => {
          console.log(e);
          this.mapComponent.showInfoLayer(`
          <div class="row">
                                <div class="col-md-12">
                                    <div class="">
                                    
                                    <i class="fa fa-users fa-2x" aria-hidden="true" title="Community"></i>
                                        <h5>${e.name}</h5>
                                        
                                    </div>
                                    <!--end feature-->
                                </div>                               
          
          `, latLng(e.lat, e.long));
        }, e);

      });
      Swal.close();

    },
      (err) => {
        console.log(err);
      });
  }

  mapZoomEnd(e: ZoomAnimEvent) {
    // let map = this.mapComponent.map;
    // let scale = map.getZoomScale(e.zoom, this.lastZoom);
    // let offSet = map._latLngToNewLayerPoint(this.lastTopLeftlatLng, e.zoom, e.center);
    // DomUtil.setTransform(this.svg, );
    // this.updatePaths();

  }
  mapMoveEnd(e: boolean) {
    let map = this.mapComponent.map;
    this.updateSVG();
    this.updateLinesNetwork();
    // if(this.lastZoom != map.getZoom()){
    //   this.updateScaleSVG();
    //   this.updateScaleSVG();
    // }else{
    //   this.updatePositionSVG();
    //   this.updateSVG();
    // }

  }
  mapSizeChange(e: boolean) {
    this.updateSVG();
    this.updateLinesNetwork();

  }

  drawEnlaces() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Drawing network...',

    });

    Swal.showLoading();
    console.log("drawEnlaces");
    let map = this.mapComponent.map;


    let pane = map.getPanes().overlayPane;

    let xmlns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(xmlns, "svg");
    let g = document.createElementNS(xmlns, "g");
    let mapSize = map.getSize();

    this.initAreaMap = mapSize.x * mapSize.y;
    svg.setAttribute('width', mapSize.x.toString());
    svg.setAttribute('height', mapSize.y.toString());
    svg.setAttribute('id', "canvas-project-network");

    svg.setAttribute('viewBox', `0 0 ${mapSize.x.toString()} ${mapSize.y.toString()}`);

    svg.appendChild(g);

    this.svg = svg;
    this.g = g;

    this.groundZoom = map.getZoom();

    this.shift = new Point(0, 0);
    this.lastZoom = map.getZoom();
    // this.initZoom = map.getZoom();

    let bounds = map.getBounds();

    this.lastTopLeftlatLng = new LatLng(bounds.getNorth(), bounds.getWest());

    this.initTopLeftlatLng = new LatLng(bounds.getNorth(), bounds.getWest())

    let paths = ``;

    this.enlaces.forEach(enl => {





      // paths += `<path d='M${point1.x},${point1.y} Q${xmed},${ymed} ${point2.x},${point2.y}' fill='none' stroke="red" stroke-width="5" class="line-network"/>`;
      paths += this.arcLines(enl);

    });

    this.updateLinesNetwork();
    g.innerHTML = paths;
    // svg.innerHTML = paths;

    pane.appendChild(svg);

    this.onClickLineNetwork();

    map.setZoom(1);

    Swal.close();
  }

  updateSVG() {
    let map = this.mapComponent.map;
    let bounds = map.getBounds();
    let size = map.getSize();
    let topLeftLatLng = new LatLng(bounds.getNorth(), bounds.getWest());
    let topLeftLayerPoint = map.latLngToLayerPoint(topLeftLatLng);
    let lastLeftLayerPoint = map.latLngToLayerPoint(this.lastTopLeftlatLng);
    let initTopLeftlatLngLayerPoint = map.latLngToLayerPoint(this.initTopLeftlatLng);
    let delta = lastLeftLayerPoint.subtract(topLeftLayerPoint);
    let delta2 = initTopLeftlatLngLayerPoint.subtract(topLeftLayerPoint);
    let zoom = map.getZoom();
    let scaleDelta = map.getZoomScale(zoom, this.lastZoom);
    let scaleDelta2 = map.getZoomScale(zoom, this.initZoom);
    // let scaleDelta = map.getZoomScale(this.initZoom, zoom);
    let scaleDiff = this.getScaleDiff(zoom);

    let difZoom = this.initZoom - zoom;
    let scaleZoomNew = Math.pow(2, Math.abs(difZoom));


    // this.shift = this.shift.multiplyBy(scaleDelta).add(delta);
    // let shift = this.shift.multiplyBy(scaleDelta).add(delta);
    let shift = this.shift.multiplyBy(scaleDelta).add(delta2);

    this.svg.setAttribute('width', size.x);
    this.svg.setAttribute('height', size.y);

    DomUtil.setPosition(this.svg, topLeftLayerPoint);

    this.svg.setAttribute('viewBox', `0 0 ${size.x} ${size.y}`);

    this.g.setAttribute("transform", "translate(" + shift.x + "," + shift.y + ") scale(" + scaleDelta2 + ")");

    // this.g.setAttribute("transform", "translate(" + this.shift.x + "," + this.shift.y + ")");
    // this.updatePaths();
    this.lastTopLeftlatLng = topLeftLatLng;
    this.lastZoom = zoom;


  }

  updateLinesNetwork() {
    let map = this.mapComponent.map;
    let size = map.getSize();
    let areaMap = size.x * size.y;
    let propAreaMap = areaMap / this.initAreaMap;
    let zoom = map.getZoom();
    let delta = this.initZoom - zoom;
    let unit = 0.5;
    if (propAreaMap > 1) {
      unit = unit * (propAreaMap * 0.5);
    }
    let propZoom = Math.pow(2, delta) * (unit / (propAreaMap));
    let lines = document.getElementsByClassName("line-network");

    for (let i = 0; i < lines.length; i++) {
      lines[i].setAttribute("stroke-width", `${propZoom.toString()}%`);
    }

  }

  getScaleDiff(zoom: number) {
    let zoomDiff = this.groundZoom - zoom;
    let scale = (zoomDiff < 0 ? Math.pow(2, Math.abs(zoomDiff)) : 1 / (Math.pow(2, zoomDiff)));
    return scale;
  }

  arcLines(enl: Enlace): string {
    let map = this.mapComponent.map;
    let point1 = enl.initPoint
    let point2 = enl.endPoint;
    
    let m = (point2.lng - point1.lng)/(point2.lat - point1.lat);
    let pmx = ((point1.lat + point2.lat) / 2);
    let pmy = ((point1.lng +point2.lng) / 2);

    let angulo = ((30 * Math.PI)/180);

    let pointControl = new LatLng(0, 0);

    if (point2.lng < point1.lng) {
      let pointAux = new LatLng(point1.lat, point1.lng);
      point1.lat = point2.lat;
      point1.lng = point2.lng;
      point2.lat = pointAux.lat;
      point2.lng = pointAux.lng;

    }

    let a = Math.sqrt(Math.pow((point1.lat-pmx), 2) + Math.pow((point1.lng-pmy), 2))

    if (m < 0) {
      console.log('pendiente negativa');
      angulo = ((Math.acos((point1.lat-pmx)/a)) - Math.PI);

    }else {
      console.log('pendiente: ', m);
      angulo = ((Math.acos((point1.lat-pmx)/a)) + angulo);
    }

    angulo = ((angulo * 180) / Math.PI);

    pointControl.lat = pmx - (a * Math.cos(angulo));
    pointControl.lng = pmy + (a * Math.sin(angulo));

    let p1 = map.latLngToLayerPoint([point1.lat, point1.lng]);
    let pc2 = map.latLngToLayerPoint([pointControl.lat, pointControl.lng]);
    let p2 = map.latLngToLayerPoint([point2.lat, point2.lng]);

    
    let items = '';
    let color = this.colorU;
    if (enl.type == 'C') {
      color = this.colorC;
    }
    items += `<path d='M${p1.x},${p1.y} C ${p1.x},${p1.y} ${pc2.x},${pc2.y} ${p2.x},${p2.y}' fill='none' stroke="${color}" stroke-width="7" style="cursor:pointer;pointer-events: initial;"class="line-network" id="enl-${enl.id}-${enl.priority}"/>`;

    return items;
  }

  onClickLineNetwork() {

    let lines = document.getElementsByClassName("line-network");
    for (let i = 0; i < lines.length; i++) {
      lines[i].addEventListener('click', () => {
        let id = lines[i].getAttribute("id");
        let itemsId = id.split("-");
        let idEnl = Number(itemsId[1]);
        let priority = Number(itemsId[2]);
        this.showInfoLineNetwork(idEnl, priority);
      });
    }
  }

  showInfoLineNetwork(idEnl: number, priority: number) {
    this.enlaces.forEach(enl => {
      if (enl.id == idEnl && enl.priority == priority) {

        this.mapComponent.showInfoLayer(`
  <div class="row">
                        <div class="col-md-12">
                            <div>
                            
                            <i class="fa fa-map-marker fa-2x" aria-hidden="true" title="Project"></i>

                            
                                <a href="project/${enl.id}"><h5>${enl.name}</h5></a>
                                <a href="profile/${enl.createdBy}">${enl.nameUser}</a>
                                <br>
                                <i class="fa fa-calendar" aria-hidden="true" title="Date"></i> ${enl.createdAt.slice(0,10)}                                       
                                <br>
                                ${enl.nameEntities}                                                                
                                <br>
                                <hr>
                                <p class="text-left">
                                ${enl.description.replace(/\n/g, "<br />")}
                                </p>

                                <div class="grid-image"> 
                                
                                
                                </div>

                            </div>
                            <!--end feature-->
                        </div>                               
  
  `, latLng(enl.initPoint.lat, enl.initPoint.lng));

      }
    });
  }

  searchActive(search: Search) {
    let inputEncoded = encodeURI(search.inputSearch);
    let startDate = search.startDate;
    let endDate = search.endDate;

    console.log(inputEncoded);
    let element = document.getElementById("canvas-project-network");
    if (element != null) {
      element.parentNode.removeChild(element);
    }
    this.setInitViewMap();
    this.removeMapLayers();
    this.getProjectNetworkBySearch(inputEncoded, startDate, endDate);
    this.getNodesBySearch(inputEncoded, startDate, endDate);

  }

  setInitViewMap() {
    let map = this.mapComponent.map;
    map.setView(latLng(this.lat, this.lon), this.initZoom);
  }

  removeMapLayers() {
    let map = this.mapComponent.map;
    this.layers.forEach((layer) => {
      map.removeLayer(layer);
    });

  }

}
