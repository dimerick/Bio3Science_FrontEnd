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



@Injectable()
export class FileService{
    public url: string;
    constructor(
        private _http: HttpClient, 
        private _authservice: AuthService
    ){
        this.url = Global.url;

    }


        loadFile(api: string, obj:any):Observable<Project>{
        
        return this._http.post(
            `${this.url}${api}`, 
            obj
        ).pipe(
            map( (resp: Project) => {
                return resp;
            },
            )
        );

    }

}