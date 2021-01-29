import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { ProjectService } from '../../services/project.service'

@Component({
  selector: 'app-my-publications',
  templateUrl: './my-publications.component.html',
  styleUrls: ['./my-publications.component.css'],
  providers: [ProjectService, UserService]
})
export class MyPublicationsComponent implements OnInit {

  public projects: Project[];
  public currentUser: User;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
  ) {
    this.getCurrentUser();


  }

  ngOnInit(): void {
  }

  getProjects() {
    this.projectService.getProjectByUser(this.currentUser.id).subscribe(
      (resp: Project[]) => {
        this.projects = resp;
        console.log(this.projects);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCurrentUser() {
    this.userService.currentUser().subscribe(resp => {
      this.currentUser = resp;
      this.getProjects();
    },
      err => {
        console.log(err);
      });
  }

  deleteProject(project: Project) {
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this project!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...',
    
        });
        Swal.showLoading();
        this.projectService.deleteProject(project.id).subscribe(resp => {
          this.getProjects();
          
          Swal.fire({
            icon: 'success',
            title: 'Project Deleted'

          });

        },
          (err) => {
            console.log(err);
            Swal.fire({
              icon: 'error',
              title: 'Hubo un problema eliminando el projecto',
              text: err
            });
          });
    
        
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } 
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   Swal.fire(
      //     'Cancelled',
      //     'Your imaginary file is safe :)',
      //     'error'
      //   )
      // }
    });

    
  }

}
