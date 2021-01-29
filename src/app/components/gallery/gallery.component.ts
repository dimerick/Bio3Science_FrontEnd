import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [ProjectService]
})
export class GalleryComponent implements OnInit {

  public projects: Project[];

  constructor(
    private projectService: ProjectService
  ) {
    this.getProjects();
  }

  ngOnInit(): void {
  }

  getProjects() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Loading Gallery...',

    });
    Swal.showLoading();
    this.projectService.getProjectsExpanded().subscribe(resp => {
      
      this.projects = resp;
      Swal.close();

      
    },
      (err) => {
        Swal.fire({
          icon: 'error', 
          title: 'Error', 
          text: err
          
        });
      });

  }
}
