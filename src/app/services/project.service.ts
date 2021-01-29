import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Profile } from '../models/profile';
import { University } from '../models/university';
import { EntitiesProject, Project } from '../models/project';
import { ProjectXUser } from '../models/project copy';
import { UserService } from './user.service';



@Injectable()
export class ProjectService{
    public url: string;
    constructor(
        private _http: HttpClient, 
        private _authservice: AuthService, 
        private userService: UserService
    ){
        this.url = Global.url;

    }


    createProject(project:Project):Observable<Project>{
        
        return this._http.post(
            `${this.url}project`, 
            project
        ).pipe(
            map( (resp: Project) => {
                return resp;
            },
            )
        );

    }

    addEntitiesProject(id: number, entities:EntitiesProject):Observable<Project>{
        
        return this._http.patch(
            `${this.url}project/${id}`, 
            entities
        ).pipe(
            map( (resp: Project) => {
                return resp;
            },
            )
        );

    }

    createProjectXUser(projectXUser:ProjectXUser):Observable<ProjectXUser>{
        
        return this._http.post(
            `${this.url}project-x-user`, 
            projectXUser
        ).pipe(
            map( (resp: ProjectXUser) => {
                return resp;
            },
            )
        );

    }

    getProjects():Observable<Project[]>{
        return this._http.get(
            `${this.url}project`
        ).pipe(
            map( (resp:Project[]) => {
                return resp;
            }
            )
            
        );
    }

    getProjectsExpanded():Observable<Project[]>{
        return this._http.get(
            `${this.url}project-expanded`
        ).pipe(
            map( (resp:Project[]) => {
                return resp;
            }
            )
            
        );
    }

    getProjectsExpandedById(idProject: number):Observable<Project>{
        return this._http.get(
            `${this.url}project-expanded/${idProject}`
        ).pipe(
            map( (resp:Project) => {
                return resp;
            }
            )
            
        );
    }

    getProjectByName(inputSearch: string){
        return this._http.get(
            `${this.url}project?name=${inputSearch}`
        ).pipe(
            map( resp => {
                return resp;
            }
            )
            
        );
    }

    getProjectByUser(idUser: number){
        return this._http.get(
            `${this.url}project?user=${idUser}`
        ).pipe(
            map( resp => {
                return resp;
            }
            )
            
        );
    }

    deleteProject(idProject: number){
        return this._http.delete(
            `${this.url}project/${idProject}`
        ).pipe(
            map( resp => {
                return resp;
            }
            )
            
        );
    }

    getProjectNetwork():Observable<any>{
        return this._http.get(
            `${this.url}project-network-expanded`
        ).pipe(
            map( resp => {
                return resp;
                
            }
            )
            
        );
    }

    getProjectNetworkBySearch(inputSearch: string):Observable<any>{
        return this._http.get(
            `${this.url}project-network-expanded?search=${inputSearch}`
        ).pipe(
            map( resp => {
                return resp;
                
            }
            )
            
        );
    }

    getProjectNetworkById(idProject: number):Observable<any>{
        return this._http.get(
            `${this.url}project-network-expanded/${idProject}`
        ).pipe(
            map( resp => {
                return resp;
                
            }
            )
            
        );
    }

    getNodes():Observable<any>{
        return this._http.get(
            `${this.url}nodes-network`
        ).pipe(
            map( (resp) => {
                return resp;
            }
            )
            
        );
    }

    getNodesBySearch(inputSearch: string):Observable<any>{
        return this._http.get(
            `${this.url}nodes-network?search=${inputSearch}`
        ).pipe(
            map( (resp) => {
                return resp;
            }
            )
            
        );
    }

    getNodesById(idProject: number):Observable<any>{
        return this._http.get(
            `${this.url}nodes-network/${idProject}`
        ).pipe(
            map( (resp) => {
                return resp;
            }
            )
            
        );
    }

    

}