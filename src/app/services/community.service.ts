import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Profile } from '../models/profile';
import { University } from '../models/university';
import { Community } from '../models/community';



@Injectable()
export class CommunityService{
    public url: string;
    constructor(
        private _http: HttpClient, 
        private _authservice: AuthService
    ){
        this.url = Global.url;

    }


    createCommunity(community:Community):Observable<Community>{
        
        return this._http.post(
            `${this.url}community`, 
            community
        ).pipe(
            map( (resp: Community) => {
                return resp;
            },
            )
        );

    }

    getCommunities():Observable<Community[]>{
        return this._http.get(
            `${this.url}community`
        ).pipe(
            map( (resp:Community[]) => {
                console.log(resp);
                return resp;
            }
            )
            
        );
    }

    getCommunityByName(inputSearch: string){
        return this._http.get(
            `${this.url}community?name=${inputSearch}`
        ).pipe(
            map( resp => {
                return resp;
            }
            )
            
        );
    }

}