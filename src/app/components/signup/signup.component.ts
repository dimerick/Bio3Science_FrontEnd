import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { PlacesService } from '../../services/places.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ValidatorsService } from 'src/app/services/validators.service';
import { Place } from 'src/app/models/place';
import { latLng, LatLng, Layer, Marker } from 'leaflet';
import { faOm } from '@fortawesome/free-solid-svg-icons';
import { CategoryService } from 'src/app/services/category.service';
import { Profile } from 'src/app/models/profile';
import { University } from 'src/app/models/university';
import { UniversityService } from 'src/app/services/university.service';
import { MapComponent } from '../map/map.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [UserService, AuthService, PlacesService, CategoryService, UniversityService
  ]
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  public resultUni: Place[];

  public url: string;
  public lat: number;
  public lon: number;
  public lat2: number;
  public lon2: number;
  public mark1: Marker;
  public mark2: Marker;
  public mark2Moved = false;
  public initLatLng2: LatLng;
  public finishedGetLocation: boolean;
  public layers: Layer[];
  public layers2: Layer[];
  public degrees = [];
  public fieldsOfStudy = [];
  public universities: any[] = [];
  public modalAddUniversityActive = false;
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  public universityRegistered: University;
  public independentInvestigator: false;

  // @Input() modalActive: boolean;
  // @Output() eventSignUpModalClose = new EventEmitter<boolean>();

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private placesService: PlacesService,
    private categoryService: CategoryService,
    private universityService: UniversityService

  ) {
    // this.modalActive = false;

    this.resultUni = [];
    this.lat = 200;
    this.lon = 200;
    this.lat2 = 200;
    this.lon2 = 200;
    this.layers = [];
    this.layers2 = [];

  }


  ngOnInit(): void {
    this.createForm();
    this.loadFormData();
    this.getLocation();
    this.getUniversities();
    this.createListeners();
  }

  onSubmit() {

    if (this.signUpForm.invalid) {

      return Object.values(this.signUpForm.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }


      });

    }

    console.log(this.signUpForm);

    let user: User = {
      id: null,
      name: this.signUpForm.value.name,
      last_name: this.signUpForm.value.last_name,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    };

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Wait please...',

    });

    Swal.showLoading();

    this._authService.singUp(user)
      .subscribe(
        resp => {

          let idRegistrado = resp.id;

          if (this.signUpForm.value.independentInvestigator) {
            let university: University = {
              id: null,
              name: this.signUpForm.value.name + ' ' + this.signUpForm.value.last_name,
              location: {
                coordinates: [this.mark2.getLatLng().lng, this.mark2.getLatLng().lat],
                type: "Point"

              },
              created_by: idRegistrado,
              created_at: null,
              tipo: 'researcher'
            };

            Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              text: 'Loading location...',

            });
            Swal.showLoading();
            this.universityService.createUniversity(university)
              .subscribe(
                resp => {
                  this.universityRegistered = resp;


                  let profile: Profile = {

                    user: idRegistrado,
                    degree: this.signUpForm.value.degree,
                    field_of_study: this.signUpForm.value.field_of_study,
                    description: this.signUpForm.value.description,
                    university: this.universityRegistered.id,
                    ind_researcher: true

                  };

                  if (this.signUpForm.value.websites) {
                    profile.websites = this.signUpForm.value.websites
                  }


                  Swal.fire({
                    allowOutsideClick: false,
                    icon: 'info',
                    text: 'Loading profile...',

                  });
                  Swal.showLoading();

                  this._userService.createProfile(profile)
                    .subscribe(
                      resp => {

                        Swal.fire({
                          icon: 'success',
                          title: 'Your registration was successful'

                        });

                      },
                      (err) => {
                        Swal.fire({
                          icon: 'error',
                          title: 'Error loading profile'
                        });
                      }

                    );

                },
                (err) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error loading location'
                  });
                }
              );

          }else {


            let profile: Profile = {

              user: idRegistrado,
              degree: this.signUpForm.value.degree,
              field_of_study: this.signUpForm.value.field_of_study,
              description: this.signUpForm.value.description,
              university: this.signUpForm.value.university,
              ind_researcher: false

            };

            if (this.signUpForm.value.websites) {
              profile.websites = this.signUpForm.value.websites
            }


            Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              text: 'Loading profile...',

            });
            Swal.showLoading();

            this._userService.createProfile(profile)
              .subscribe(
                resp => {

                  if (this.universityRegistered) {
                    this.universityRegistered.created_by = idRegistrado;

                    this.universityService
                      .updateOwnerUniversity(this.universityRegistered, idRegistrado)
                      .subscribe(resp => {
                        this.signUpForm.reset();
                        // this.modalActive = false;
                        Swal.fire({
                          icon: 'success',
                          title: 'Your registration was successful'

                        });
                      },
                        (err) => {

                        });

                  }

                },
                (err) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error loading profile'
                  });
                }

              );



          }




        },
        (err) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Error creating user',
            text: ''
          });

        }
      );

  }

  // closeModal(){
  //   this.modalActive = false;
  //   this.eventSignUpModalClose.emit(true);
  // }

  noMatchPasswords() {
    const password = this.signUpForm.get('password').value;
    const confirmPassword = this.signUpForm.get('confirmPassword').value;

    return (password === confirmPassword) ? false : true;
  }

  createForm() {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      last_name: ['', Validators.required],
      email: ['',
        [Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')], this.validatorsService.existeEmail],
      degree: ['', Validators.required],
      field_of_study: ['', Validators.required],
      description: ['', Validators.required],
      independentInvestigator: [false],
      university: [''],
      websites: [''],
      //university: ['', Validators.required],  
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    }, {
      validators: [
        this.validatorsService.passwordMatch('password', 'confirmPassword'),
        this.validatorsService.typeInvestigator('independentInvestigator', 'university'),
      ]
    });
    console.log(this.signUpForm);
  }

  loadFormData() {
    this.signUpForm.setValue(
      {
        name: '',
        last_name: '',
        email: '',
        degree: '',
        field_of_study: '',
        description: '',
        independentInvestigator: false,
        university: null,
        websites: '',
        //university: '', 
        password: '',
        confirmPassword: '',
        agree: false
      }
    );
    this.getDegrees();
    this.getFieldsOfStudy();

    this.scrollToForm();
  }

  createListeners() {

    this.signUpForm.get('independentInvestigator').valueChanges.subscribe(value => {
      console.log(value);
      this.independentInvestigator = value;

      if (!this.independentInvestigator) {
        if (this.mark2 != null) {
          this.mapComponent.map.removeLayer(this.mark2);
        }
      }

    });

    this.signUpForm.valueChanges.subscribe(form => {
      // console.log(form);
      console.log(this.signUpForm);



    });

    //     this.signUpForm.get('university').valueChanges.subscribe(value =>{

    // this.resultUni = [];
    // if(value.length >= 3){

    //   this.placesService.getPlaces(value).subscribe(
    //     resp => {


    //       let data = JSON.parse(JSON.stringify(resp));

    //       for(let i=0;i < data.length;i++){
    //         console.log(data[i].description);
    //         let place = new Place(data[i].description, data[i].place_id);
    //         this.resultUni.push(place);
    //       }


    //     }
    //   );

    // }


    //     });
  }

  getLocation() {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {

        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        this.lat2 = position.coords.latitude;
        this.lon2 = position.coords.longitude;
        this.initLatLng2 = latLng(position.coords.latitude, position.coords.longitude);
        console.log(`Se obtuvo la ubicacion ${this.lat}-${this.lon}`);

      });
    } else {
      this.lat = 39.952583;
      this.lon = -75.165222;
      this.lat2 = 39.952583;
      this.lon2 = -75.165222;
      this.initLatLng2 = latLng(39.952583, -75.165222);

    }

    console.log(`Se obtuvo la ubicacion ${this.lat}-${this.lon}`);

  }

  markerMoved(e: LatLng) {
    console.log(e);
    this.lat = e.lat;
    this.lon = e.lng;
  }

  marker2Moved(e: LatLng) {
    console.log(e);
    this.lat2 = e.lat;
    this.lon2 = e.lng;
    console.log(this.mark2);
    this.mark2Moved = true;
  }

  getDegrees() {
    this.categoryService.getDegrees().subscribe(resp => {
      console.log(resp);
      this.degrees = resp;
    },
      (err) => {
        console.log(err);
      });
  }

  getFieldsOfStudy() {
    this.categoryService.getFieldsOfStudy().subscribe(resp => {
      console.log(resp);
      this.fieldsOfStudy = resp;
    },
      (err) => {
        console.log(err);
      });
  }

  getUniversities() {
    this.universityService.getUniversities().subscribe(
      resp => {
        this.universities = resp;
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

  toggleAddUniversity() {
    console.log("Añadir University");
    document.body.classList.toggle("modal-open");
    console.log(this.modalAddUniversityActive);
    this.modalAddUniversityActive = !this.modalAddUniversityActive;

  }

  universiyRegistered(e: University) {
    console.log(e);
    this.universityRegistered = e;
    this.getUniversities();
    this.signUpForm.get('university').setValue(e.id);
    this.lat = e.location.coordinates[1];
    this.lon = e.location.coordinates[0];
    this.mapComponent.updateMark(new LatLng(this.lat, this.lon));
    this.toggleAddUniversity();
  }


  scrollToForm() {
    let element = document.querySelector("#contSignUpForm");
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  markerAdded(e: Marker) {
    this.mark1 = e;
  }

  marker2Added(e: Marker) {
    this.mark2 = e;
  }

  addIndependentInvestigator = (university: University): Observable<University> => new Observable(subscriber => {

    this.universityService.createUniversity(university)
      .subscribe(
        (resp: University) => {
          subscriber.next(resp);
          subscriber.complete();
        },
        (err) => {
          subscriber.error(err);
        }
      );

  });

}
