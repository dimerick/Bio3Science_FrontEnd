import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LatLng } from 'leaflet';
import { Layer } from 'leaflet';
import { University } from 'src/app/models/university';
import { User } from 'src/app/models/user';
import { UniversityService } from 'src/app/services/university.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.css'],
  providers: [UniversityService, UserService]
})
export class UniversityComponent implements OnInit {
  universityForm: FormGroup;
  public lat: number;
  public lon: number;
  public layers: Layer[];
  public items: University[] = [];
  public universityRegistered: University;
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  @Output() universiyRegisteredEvent: EventEmitter<University> = new EventEmitter;
  public currentUser: User;

  constructor(
    private universityService: UniversityService, 
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.lat = 200;
    this.lon = 200;
    this.layers = [];
    this.getLocation();
    this.universityForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    // this.createListeners();
    this.getUniversities();
    this.getCurrentUser();
  }

  ngOnInit(): void {
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

  onSubmit() {
    let currentUserId = null;
    if(this.currentUser != null){
      currentUserId = this.currentUser.id;
    }

    let university: University = {
      id: null, name: this.universityForm.value.name,
      location: {
        coordinates: [this.lon, this.lat],
        type: "Point"

      }, 
      created_by: currentUserId, 
      created_at: null, 
    };
    if(university.created_by == null){
      university = {
        id: null, name: this.universityForm.value.name,
        location: {
          coordinates: [this.lon, this.lat],
          type: "Point"
  
        },  
        created_at: null, 
      };
    }
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',

    });
    Swal.showLoading();
    this.universityService.createUniversity(university)
      .subscribe(
        resp => {
          this.universityRegistered = resp;
          this.universityForm.reset();
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso'

          }).then((result) => {
            if (result.isConfirmed) {
              this.emitUniversityRegistered();
            }
          });
          
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar la universidad'
          });
        }
      );
  }

  createListeners() {

    this.universityForm.get('name').valueChanges.subscribe(form => {
      //console.log(form);

      let name = this.universityForm.get('name').value;
      if (name.length >= 3) {
        this.universityService.getUniversityByName(name).subscribe(
          (resp: University[]) => {
            console.log(resp);
            console.log(this);
            this.items = resp;

          },
          (err) => {
            console.log(err);
          }
        );
      }



    });

  }

  markerMoved(e: LatLng) {
    console.log(e);
    this.lat = e.lat;
    this.lon = e.lng;
  }

  getUniversities() {
    this.universityService.getUniversities().subscribe(
      resp => {
        this.items = resp;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onChange(e: any) {
    console.log(e);
    if (e != null) {
      this.lat = e.location.coordinates[1];
      this.lon = e.location.coordinates[0];
      console.log(this.lat, this.lon);
      this.mapComponent.updateMark(new LatLng(this.lat, this.lon));

    }
  }

  emitUniversityRegistered() {
    
    this.universiyRegisteredEvent.emit(this.universityRegistered);
  }

  getCurrentUser(){
    this.userService.currentUser().subscribe(resp=> {
console.log(resp);
this.currentUser = resp;
    }, 
    err => {
      console.log(err);
    });
  }

}
