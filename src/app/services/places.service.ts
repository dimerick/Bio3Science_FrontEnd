import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Place } from '../models/place';


@Injectable()
export class PlacesService{
    public url: string;
    public google_key: string
    constructor(
        private _http: HttpClient, 
        private _authservice: AuthService
    ){
        this.url = Global.url;
        // this.google_key = Global.google_key

    }

    

    getPlaces(inputSearch: string){
        let params = new HttpParams().set('input_search', inputSearch);
        return this._http.get(
            `${this.url}place/${inputSearch}`
        ).pipe(
            map( resp => {
                return resp;
            }
            )
            
        );
    }

}