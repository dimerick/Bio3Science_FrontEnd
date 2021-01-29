import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  providers: [ProjectService]
})
export class ProjectListComponent implements OnInit {

  projects:Project[];

  constructor(
    private projectService: ProjectService
  ) { 

    this.getProjects();
  }

  ngOnInit(): void {
  }


  getProjects() {
    this.projectService.getProjects().subscribe(
      resp => {
        this.projects = resp;
        console.log(this.projects);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  
}
