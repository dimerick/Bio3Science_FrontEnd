import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { circle, Icon, LatLng, Layer, marker, Marker, point, Point, Polyline, polyline, DivIcon, DomEvent, latLng, svgOverlay, SVGOverlay, LatLngBounds, icon, divIcon, Map, ZoomAnimEvent, canvas, svg, SVG, layerGroup, LayerGroup, DomUtil, map } from 'leaflet';
import { Enlace } from 'src/app/models/enlace';
import { LayerMap } from 'src/app/models/LayerMap';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { UniversityService } from 'src/app/services/university.service';
import Swal from 'sweetalert2';
import { MapComponent } from '../map/map.component';






@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  providers: [ProjectService]
})
export class ProjectDetailComponent implements OnInit {
  public project: Project;
  public idProject: number;
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
  public initZoom: number;
  public colorU = '#03a7e5';
  public colorC = '#63bb8c';
  public galleryActive = false;

  public canvasIconClean = divIcon({
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, 0],
    html: '',
    className: 'canvas-project-network'
  });

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {
    this.lat = 200;
    this.lon = 200;
    this.getLocation();
    // this.getProjects();


  }

  ngOnInit(): void {
    this.getLocation();
    this.route.params.subscribe(params => {
      this.idProject = +params['id'];
    });


  }

  getLocation() {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {

        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;


      });
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
      text: 'Loading Project...',

    });
    Swal.showLoading();
    this.projectService.getProjectNetworkById(this.idProject).subscribe(resp => {

      if (resp[0].projects.length > 0) {
        let project: Project = {
          id: resp[0].projects[0].id,
          name: resp[0].projects[0].name,
          description: resp[0].projects[0].description,
          created_at: resp[0].projects[0].created_at,
          created_by: resp[0].projects[0].created_by,
          user_name: resp[0].projects[0].user_name,
          user_last_name: resp[0].projects[0].user_last_name,
          main_university: resp[0].id,
          name_uni: resp[0].name,
          universidad: resp[0].name,
          images: resp[0].projects[0].images
        }

        this.project = project;
        if(project.images != null){
          if(project.images.length > 0){
this.galleryActive = true;
          }

        }
      }


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
              nameEntities: uni.name + ` <i class="fa fa-arrows-h" aria-hidden="true" title="Avatar"></i> ` + arista.assoc_name

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

  getNodes() {
    this.projectService.getNodesById(this.idProject).subscribe(resp => {
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

        console.log(mark);

        this.layers.push(mark);



        mark.addEventListener('click', (layer) => {
          console.log(e);
          this.mapComponent.showInfoLayer(`
          <div class="row">
                                <div class="col-md-12">
                                    <div class="text-center">

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
                                    <div class="text-center">
                                    
                                    <i class="fa fa-users fa-2x" aria-hidden="true" title="Community"></i>
                                        <h5>${e.name}</h5>
                                        
                                    </div>
                                    <!--end feature-->
                                </div>                               
          
          `, latLng(e.lat, e.long));
        }, e);

      });

    },
      (err) => {
        console.log(err);
      });
  }

  mapZoomEnd(e: ZoomAnimEvent) {
    this.updateLinesNetwork();
    // let map = this.mapComponent.map;
    // let scale = map.getZoomScale(e.zoom, this.lastZoom);
    // let offSet = map._latLngToNewLayerPoint(this.lastTopLeftlatLng, e.zoom, e.center);
    // DomUtil.setTransform(this.svg, );
    // this.updatePaths();

  }
  mapMoveEnd(e: boolean) {
    let map = this.mapComponent.map;
    this.updateSVG();
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

  }

  drawEnlaces() {
    console.log("drawEnlaces");
    let map = this.mapComponent.map;


    let pane = map.getPanes().overlayPane;

    let xmlns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(xmlns, "svg");
    let g = document.createElementNS(xmlns, "g");
    let mapSize = map.getSize();

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
    this.initZoom = map.getZoom();

    let bounds = map.getBounds();

    this.lastTopLeftlatLng = new LatLng(bounds.getNorth(), bounds.getWest());

    this.initTopLeftlatLng = new LatLng(bounds.getNorth(), bounds.getWest())

    let paths = ``;

    this.enlaces.forEach(enl => {





      // paths += `<path d='M${point1.x},${point1.y} Q${xmed},${ymed} ${point2.x},${point2.y}' fill='none' stroke="red" stroke-width="5" class="line-network"/>`;
      paths += this.arcLines(enl);

    });

    g.innerHTML = paths;
    // svg.innerHTML = paths;

    pane.appendChild(svg);

    this.onClickLineNetwork();

    map.setZoom(1);

    this.mapComponent.map.panTo(this.enlaces[0].initPoint);

    map.setZoom(10);

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
    let zoom = map.getZoom();
    let delta = this.initZoom - zoom;
    let propZoom = Math.pow(2, delta) * 0.7;
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
    let point1 = this.mapComponent.map.latLngToLayerPoint(enl.initPoint);
    let point2 = this.mapComponent.map.latLngToLayerPoint(enl.endPoint);
    let x1 = point1.x;
    let y1 = point1.y;
    let x2 = point2.x;
    let y2 = point2.y;
    let cx = (x1 + x2) / 2;
    let cy = (y1 + y2) / 2;
    let dx = (x2 - x1) / 2;
    let dy = (y2 - y1) / 2;
    let items = '';
    let n = 1;
    let color = this.colorU;
    if (enl.type == 'C') {
      color = this.colorC;
    }
    for (let i = 0; i < n; i++) {
      if ((i == (n - 1) / 2) && false) {
        items += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" fill='none' stroke="${color}" stroke-width="5" class="line-network"/>`;

      }
      else {
        let sentido = 1;
        if (enl.type == 'C') {
          sentido = -1;
        }
        let dd = Math.sqrt(dx * dx + dy * dy);
        // let ex = cx + dy/dd * k * (i-(n-1)/2);
        // let ey = cy - dx/dd * k * (i-(n-1)/2);
        let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        let ex = (cx + dy / dd * (distance / 4) * (enl.priority * 0.5)) * sentido;
        let ey = (cy - dx / dd * (distance / 4) * (enl.priority * 0.5));
        items += `<path d='M${x1},${y1} Q${ex},${ey} ${x2},${y2}' fill='none' stroke="${color}" stroke-width="7" style="cursor:pointer;pointer-events: initial;"class="line-network" id="enl-${enl.id}-${enl.priority}"/>`;
      }
    }

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
                            <div class="text-center">
                            <i class="fa fa-map-marker fa-2x" aria-hidden="true" title="Project"></i>
                            
                                <h5>${enl.name}</h5>
                                ${enl.nameEntities}                                         
                                <br>
                                <br>
                                <p class="text-left">
                                ${enl.description.replace(/\n/g, "<br />")}
                                </p>
                            </div>
                            

                                <div class="grid-image"> 
                                
                                
                                </div>

                            </div>
                            <!--end feature-->
                        </div>                               
  
  `, latLng(enl.initPoint.lat, enl.initPoint.lng));

      }
    });
  }

}
