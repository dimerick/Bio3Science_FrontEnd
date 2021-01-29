import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Profile } from '../models/profile';
import { University } from '../models/university';



@Injectable()
export class UniversityService{
    public url: string;
    constructor(
        private _http: HttpClient, 
        private _authservice: AuthService
    ){
        this.url = Global.url;

    }


    createUniversity(university:University):Observable<University>{
        
        return this._http.post(
            `${this.url}university`, 
            university
        ).pipe(
            map( (resp: University) => {
                return resp;
            },
            )
        );

    }

    updateOwnerUniversity(university:University, userId: number):Observable<University>{
        
        return this._http.put(
            `${this.url}university/${university.id}?created_by=${userId}`, 
            university
        ).pipe(
            map( (resp: University) => {
                return resp;
            },
            )
        );

    }

    getUniversities():Observable<University[]>{
        return this._http.get(
            `${this.url}university`
        ).pipe(
            map( (resp:University[]) => {
                console.log(resp);
                return resp;
            }
            )
            
        );
    }

    getUniversityByName(inputSearch: string):Observable<University[]>{
        return this._http.get(
            `${this.url}university?name=${inputSearch}`
        ).pipe(
            map( (resp: University[]) => {
                return resp;
            }
            )
            
        );
    }

    getUniversityById(id: Number):Observable<University>{
        return this._http.get(
            `${this.url}university/${id}`
        ).pipe(
            map( (resp: University) => {
                return resp;
            }
            )
            
        );
    }

    getUniversityAssociated(mainId: Number):Observable<University[]>{
        return this._http.get(
            `${this.url}university?exclude_id=${mainId}`
        ).pipe(
            map( (resp: University[]) => {
                return resp;
            }
            )
            
        );
    }

    

}