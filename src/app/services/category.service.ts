import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';



@Injectable()
export class CategoryService {
    public url: string;
    constructor(
        private _http: HttpClient,
        private _authservice: AuthService
    ) {
        this.url = Global.url;

    }


    getDegrees(): Observable<any> {
        return this._http.get(
            `${this.url}degree`
        ).pipe(
            map(resp => {
                return resp;
            }
            )

        );
    }

    getFieldsOfStudy(): Observable<any> {
        return this._http.get(
            `${this.url}fields-of-study`
        ).pipe(
            map(resp => {
                return resp;
            }
            )

        );
    }

}