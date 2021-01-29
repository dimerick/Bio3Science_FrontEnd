import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LatLng, Layer } from 'leaflet';
import { Community } from 'src/app/models/community';
import { EntitiesProject, Project } from 'src/app/models/project';
import { ProjectXUser } from 'src/app/models/project copy';
import { University } from 'src/app/models/university';
import { User } from 'src/app/models/user';
import { CommunityService } from 'src/app/services/community.service';
import { ProjectService } from 'src/app/services/project.service';
import { UniversityService } from 'src/app/services/university.service';
import { UserService } from 'src/app/services/user.service';
import { ValidatorsService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';
import { CurrentUserComponent } from '../current-user/current-user.component';
import { MapComponent } from '../map/map.component';
import { LoadFilesComponent } from '../load-files/load-files.component';
import { FileService } from 'src/app/services/file.service';
import { Observable } from 'rxjs';
import { isNull } from '@angular/compiler/src/output/output_ast';



@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [ProjectService, UniversityService, CommunityService, FileService]
})
export class ProjectComponent implements OnInit {
  projectForm: FormGroup;
  public universities: University[] = [];
  public universitiesAssociated: University[] = [];
  public projects: Project[] = [];
  projectRegistered: Project;
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  public lat: number;
  public lon: number;
  public layers: Layer[];
  public modalAddUniversityActive = false;
  public idNewProject = -1;
  public currentUser: User;
  public projectSelected: Project;
  public universityRegistered: University;
  public communitiesAssociated: Community[] = [];
  public modalAddCommunityActive = false;
  public communityRegistered: Community;
  public mainUniversityDisabled = false;
  @ViewChild(LoadFilesComponent)
  private loadFilesComponent: LoadFilesComponent;
  public loadImagesActive = true;
  public mainUniversitySelected = false;
  public inputProjectSearch = "";



  constructor(
    private universityService: UniversityService,
    private projectService: ProjectService,
    private userService: UserService,
    private communityService: CommunityService,
    private validatorsService: ValidatorsService,
    private fb: FormBuilder,
    private fileService: FileService) {
    this.projectForm = this.fb.group({
      project: [null, [Validators.required]],
      description: ['', [Validators.required]],
      university: [null, [Validators.required]],
      universitiesAssociated: [null],
      communitiesAssociated: [null],
    }, {
      validators: this.validatorsService.entitiesAssociated('project', 'universitiesAssociated', 'communitiesAssociated')
    });
    this.getProjects();
    this.getUniversities();
    this.getCommunities();
    this.getCurrentUser();
    this.lat = 200;
    this.lon = 200;
    this.layers = [];

  }

  ngOnInit(): void {

    this.getLocation();
    this.createListeners();
  }

  getLocation() {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {

        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        console.log(`Se obtuvo la ubicacion ${this.lat}-${this.lon}`);

      });
    } else {
      this.lat = 39.952583;
      this.lon = -75.165222;

    }

    console.log(`Se obtuvo la ubicacion ${this.lat}-${this.lon}`);

  }

  getProjects() {
    this.projectService.getProjectsExpanded().subscribe(
      resp => {
        this.projects = resp;
        console.log(this.projects);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit() {

    if(this.projectForm.invalid){

      

      return Object.values( this.projectForm.controls ).forEach( control => {
        
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
        
        
        
      });
      

    }

    let project: Project = {
      id: null,
      name: this.projectSelected.name,
      description: this.projectForm.value.description,
      created_by: this.currentUser.id,
      created_at: null,
      main_university: this.projectForm.value.university,
      name_uni: null

    };



    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Loading project...',

    });
    Swal.showLoading();
    /*Se ejecuta si es un nuevo proyecto */
    if (this.projectForm.value.project < 0) {


      this.createProject(project).subscribe(resp => {
        console.log(resp);
        this.projectRegistered = resp;

        let universitiesAssociated = this.projectForm.value.universitiesAssociated;
        let communitiesAssociated = this.projectForm.value.communitiesAssociated;

        if (universitiesAssociated != null || communitiesAssociated != null) {

          let entities: EntitiesProject = {
            universities: universitiesAssociated,
            communities: communitiesAssociated
          };

          if(universitiesAssociated != null && communitiesAssociated == null){
            entities = {
              universities: universitiesAssociated
            };
          }

          if(communitiesAssociated != null && universitiesAssociated == null){
            entities = {
              communities: communitiesAssociated
            };
          }    

          

          console.log(entities);
          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            text: 'Loading associated entities...',

          });
          Swal.showLoading();

          this.addEntitiesProject(resp, entities).subscribe(resp => {

            if (this.loadFilesComponent.files.length > 0) {

              Swal.fire({
                allowOutsideClick: false,
                icon: 'info',
                text: 'Loading images...',

              });
              Swal.showLoading();
              this.loadImages(this.projectRegistered).subscribe(resp => {

                Swal.fire({
                  icon: 'success',
                  title: 'Project registration was successful'

                });

                this.resetForm();

              },
                (err) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error loading images',
                    text: err
                  });
                });

            } else {

              Swal.fire({
                icon: 'success',
                title: 'Project registration was successful'

              });

              this.resetForm();

            }



          },
            (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Error loading associated entities',
                text: err
              });

            });

        }else{

          if (this.loadFilesComponent.files.length > 0) {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              text: 'Loading images...',

            });
            Swal.showLoading();
            this.loadImages(this.projectRegistered).subscribe(resp => {

              Swal.fire({
                icon: 'success',
                title: 'Project registration was successful'

              });

              this.resetForm();

            },
              (err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error loading images',
                  text: err
                });
              });
          }else{
            Swal.fire({
              icon: 'success',
              title: 'Project registration was successful'

            });

            this.resetForm();

          }

        }



      },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error loading project',
            text: err
          });
          console.log(err);
        });

    }
    /**Añadir entidades al proyecto Seleccionado */
    else {
      let universitiesAssociated = this.projectSelected.universities.concat(this.projectForm.value.universitiesAssociated);
      console.log("universitiesAssociated", universitiesAssociated);
      let universitiesAssociatedSet = new Set(universitiesAssociated);
      universitiesAssociated = [...universitiesAssociatedSet];
      console.log("universitiesAssociated", universitiesAssociated);

      let communitiesAssociated = this.projectSelected.communities.concat(this.projectForm.value.communitiesAssociated);
      console.log("communitiesAssociated", communitiesAssociated);
      let communitiesAssociatedSet = new Set(communitiesAssociated);
      communitiesAssociated = [...communitiesAssociatedSet];
      console.log("communitiesAssociated", communitiesAssociated);



      let entities: EntitiesProject = {
        universities: universitiesAssociated.filter(x => x !== null),
        communities: communitiesAssociated.filter(x => x !== null)
      };

      console.log(entities);


      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Loading associated entities...',

      });
      Swal.showLoading();

      this.addEntitiesProject(this.projectSelected, entities).subscribe(resp => {

        Swal.fire({
          icon: 'success',
          title: 'Associated entities registration was successful'

        });

        this.resetForm();

      },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error loading associated entities',
            text: err
          });

        });

    }

  }

  markerMoved(e: LatLng) {
    console.log(e);
    this.lat = e.lat;
    this.lon = e.lng;
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

  getCommunities() {
    this.communityService.getCommunities().subscribe(
      resp => {
        this.communitiesAssociated = resp;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onChangeUniversity(e: any) {
    console.log(e);
    if (e != null) {
      this.mainUniversitySelected = true;
      this.lat = e.location.coordinates[1];
      this.lon = e.location.coordinates[0];
      console.log(this.lat, this.lon);
      this.mapComponent.updateMark(new LatLng(this.lat, this.lon));

      let mainId = this.projectForm.value.university;

      this.updateUniversitiesAssociated(mainId);


    } else {
      this.mainUniversitySelected = false;
    }


  }
  onChangeUniversitiesAssociated(e: any) {
    console.log(e);
    if (e != null) {
      // this.lat = e.location.coordinates[1];
      // this.lon = e.location.coordinates[0];
      console.log(this.lat, this.lon);
      // this.mapComponent.updateMark(new LatLng(this.lat, this.lon));

    }
  }

  onChangeCommunitiesAssociated(e: any) {
    console.log(e);
    if (e != null) {
      // this.lat = e.location.coordinates[1];
      // this.lon = e.location.coordinates[0];
      console.log(this.lat, this.lon);
      // this.mapComponent.updateMark(new LatLng(this.lat, this.lon));

    }
  }


  onChangeProject(e: any) {
    this.inputProjectSearch = "";
    console.log(e);
    this.projectSelected = e;
    console.log(this.projectSelected);



    if (this.projectForm.value.project > 0) {
      console.log("El proyecto existe");
      this.loadImagesActive = false;
      this.projectForm.controls.description.setValue(this.projectSelected.description);
      this.projectForm.controls.description.disable();
      this.projectForm.controls.university.setValue(this.projectSelected.main_university);
      this.mainUniversityDisabled = true;



      this.universityService.getUniversityById(this.projectSelected.main_university)
        .subscribe(resp => {
          console.log("main_university", resp);
          this.lon = resp.location.coordinates[0];
          this.lat = resp.location.coordinates[1];
          this.mapComponent.updateMark(new LatLng(this.lat, this.lon));

        },

          (err) => {
            console.log(err);
          });

      this.mainUniversitySelected = true;

      let mainId = this.projectSelected.main_university;

      this.updateUniversitiesAssociated(mainId);



    } else {
      console.log("El proyecto es nuevo");
      this.loadImagesActive = true;
      this.projectForm.controls.description.reset();
      this.projectForm.controls.description.enable();
      this.projectForm.controls.university.reset();
      this.mainUniversityDisabled = false;
    }


  }

  toggleAddUniversity() {
    
    document.body.classList.toggle("modal-open");
    this.modalAddUniversityActive = !this.modalAddUniversityActive;
  }

  toggleAddCommunity() {
    
    document.body.classList.toggle("modal-open");
    this.modalAddCommunityActive = !this.modalAddCommunityActive;
  }


  eventUniversityRegistered(e: University) {
    
    console.log(e);
    this.universityRegistered = e;
    this.getUniversities();
    let mainId = this.projectForm.value.university;
    this.updateUniversitiesAssociated(mainId);
    if (this.projectForm.value.university == null) {
      this.projectForm.get('university').setValue(e.id);
      this.mainUniversitySelected = true;
    } else if (this.projectForm.value.universitiesAssociated == null) {
      this.projectForm.get('universitiesAssociated').setValue([e.id]);
    } else {
      let arr = this.projectForm.value.universitiesAssociated;
      arr.push(e.id);
      this.projectForm.get('universitiesAssociated').setValue(arr);
    }

    // this.projectForm.get('university').setValue(e.id);
    this.lat = e.location.coordinates[1];
    this.lon = e.location.coordinates[0];
    this.mapComponent.updateMark(new LatLng(this.lat, this.lon));

    this.toggleAddUniversity();
  }

  eventCommunityRegistered(e: Community) {
    console.log(e);
    this.communityRegistered = e;
    this.getCommunities();

    if (this.projectForm.value.communitiesAssociated == null) {
      this.projectForm.get('communitiesAssociated').setValue([e.id]);
    } else {
      let arr = this.projectForm.value.communitiesAssociated;
      arr.push(e.id);
      this.projectForm.get('communitiesAssociated').setValue(arr);
    }

    this.toggleAddCommunity();
  }

  addProject = (name: string) => {
    let project: Project = {
      id: this.idNewProject,
      name: name,
      description: null,
      created_by: null,
      created_at: null,
      main_university: null,
      name_uni: null

    };

    this.projects = [...this.projects, project];
    // this.projectForm.get('project').setValue(this.idNewProject--);


  }

  createListeners() {

    this.projectForm.valueChanges.subscribe(form => {
      //console.log(form);
      console.log(this.projectForm);
      this.getCurrentUser();


    });
  }

  getCurrentUser() {
    this.userService.currentUser().subscribe(resp => {
      console.log(resp);
      this.currentUser = resp;
    },
      err => {
        console.log(err);
      });
  }

  loadImages = (project: Project) => new Observable(subscriber => {
    let files = this.loadFilesComponent.files;

    let numLoaded = 0;
    files.forEach(f => {
      const formData = new FormData();


      formData.append('image', f);
      formData.append('project', project.id.toString());

      this.fileService.loadFile('project-image', formData).subscribe(resp => {
        numLoaded += 1;
        if (numLoaded == files.length) {


          subscriber.next(true);
          subscriber.complete();

        }
        console.log(resp);


      },
        (err) => {
          subscriber.error(err);
        });
    });


  });


  createProject = (project: Project): Observable<Project> => new Observable(subscriber => {

    this.projectService.createProject(project)
      .subscribe(
        (resp: Project) => {
          console.log(resp);
          subscriber.next(resp);
          subscriber.complete();
        },
        (err) => {
          subscriber.error(err);
        }
      );

  });

  addEntitiesProject = (project: Project, entities: EntitiesProject): Observable<Project> => new Observable(subscriber => {

    this.projectService.addEntitiesProject(project.id, entities)
      .subscribe(
        (resp: Project) => {
          subscriber.next(resp);
          subscriber.complete();
        },
        (err) => {
          subscriber.error(err);
        }
      );

  });

  resetForm() {
    this.projectForm.reset();
    this.loadFilesComponent.files = [];

  }

  typingSearchProject(search) {
    console.log(search);
    this.inputProjectSearch = search.term;
  }

  closeProject() {
    if (this.inputProjectSearch != "") {

      let project: Project = {
        id: this.idNewProject,
        name: this.inputProjectSearch,
        description: null,
        created_by: null,
        created_at: null,
        main_university: null,
        name_uni: this.inputProjectSearch,
        universities: [],
        communities: []

      };

      this.projects = [...this.projects, project];

      this.projectForm.get('project').setValue(this.idNewProject);
      this.projectSelected = project;
      this.mainUniversitySelected = true;

      this.idNewProject = this.idNewProject - 1;

      this.inputProjectSearch = "";

    }



  }

  updateUniversitiesAssociated(mainId: number) {
    this.universityService.getUniversityAssociated(mainId).subscribe(resp => {
      this.universitiesAssociated = resp;
    },
      (err) => {
        console.log(err);
      });
  }



}
