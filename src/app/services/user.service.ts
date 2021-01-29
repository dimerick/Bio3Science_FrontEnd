import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Profile } from '../models/profile';



@Injectable()
export class UserService{
    public url: string;
    constructor(
        private _http: HttpClient, 
        private _authservice: AuthService
    ){
        this.url = Global.url;

    }


    currentUser():Observable<User>{
        // console.log('obteniedo el usuario actual');
        let token = this._authservice.readToken();
        let userId = '';
        if(token != ''){
            userId = JSON.parse(atob(token.split('.')[1])).user_id;
        }
        
        console.log(userId);
        return this._http.get<User>(`${this.url}account/${userId}`)
            .pipe(map(user => {
                return user;
            }
            ));
    }

    emailDisponible(email: string):Observable<any>{
        return this._http.get(
            `${this.url}account?email=${email}`
        ).pipe(
            map( resp => {
                return resp;
            }
            )
            
        );
    }

    createProfile(profile:Profile):Observable<Profile>{
        
        return this._http.post(
            `${this.url}profile`, 
            profile
        ).pipe(
            map( (resp: Profile) => {
                return resp;
            },
            )
        );

    }

    getInfoUser(idUser: number):Observable<any>{
        
        return this._http.get(
            `${this.url}profile/${idUser}`
        ).pipe(
            map((resp) => {
                return resp;
            },
            )
        );

    }

}