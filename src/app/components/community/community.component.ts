import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LatLng } from 'leaflet';
import { Layer } from 'leaflet';
import { Community } from 'src/app/models/community';
import { User } from 'src/app/models/user';
import { CommunityService } from 'src/app/services/community.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'], 
  providers: [CommunityService, UserService]
})
export class CommunityComponent implements OnInit {

  communityForm: FormGroup;
  public lat: number;
  public lon: number;
  public layers: Layer[];
  public items: Community[] = [];
  public communityRegistered: Community;
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  @Output() communityRegisteredEvent: EventEmitter<Community> = new EventEmitter;
  public currentUser: User;

  constructor(
    private communityService: CommunityService, 
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.lat = 200;
    this.lon = 200;
    this.layers = [];
    this.getLocation();
    this.communityForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    // this.createListeners();
    this.getCommunities();
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

    let community: Community = {
      id: null, name: this.communityForm.value.name,
      location: {
        coordinates: [this.lon, this.lat],
        type: "Point"

      }, 
      created_by: this.currentUser.id, 
      created_at: null, 
    };
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',

    });
    Swal.showLoading();
    this.communityService.createCommunity(community)
      .subscribe(
        resp => {
          this.communityRegistered = resp;
          this.communityForm.reset();
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso'

          }).then((result) => {
            if (result.isConfirmed) {
              this.emitCommunityRegistered();
            }
          });;
          
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar la comunidad'
          });
        }
      );
  }

  createListeners() {

    this.communityForm.get('name').valueChanges.subscribe(form => {
      //console.log(form);

      let name = this.communityForm.get('name').value;
      if (name.length >= 3) {
        this.communityService.getCommunityByName(name).subscribe(
          (resp: Community[]) => {
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

  getCommunities() {
    this.communityService.getCommunities().subscribe(
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

  emitCommunityRegistered() {
    
    this.communityRegisteredEvent.emit(this.communityRegistered);
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
