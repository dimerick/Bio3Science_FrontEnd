
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from '../models/user';
import { Global } from './global';



@Injectable({ providedIn: 'root' })
export class AuthService{
    public url: string;
    public userToken: string;
    public userRefreshToken: string;
    private refreshTokenTimeout;

    constructor(
        private _http: HttpClient
    ){
        this.url = Global.url;
        this.readToken();

    }

    singIn(user:User){
        return this._http.post(
            `${this.url}token`, 
            user
        ).pipe(
            map( resp => {
                this.saveToken(resp["refresh"], resp["access"]);
                //this.startRefreshTokenTimer();
                return resp;
            },
            )
            // catchError(err => {
            //     console.log(err);
            //     return Observable.throw(err);
            // })
        );
    }

    singUp(user:User):Observable<User>{
        
        return this._http.post(
            `${this.url}account`, 
            user
        ).pipe(
            map( (resp: User) => {
                return resp;
            },
            )
        );

    }

    logout(){
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
        window.location.href = '/gallery';

    }


    private saveToken(refreshToken:string, token: string){
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('token', token);

    }

    readToken(){
        // console.log('readToken');
        if(localStorage.getItem('token')){
            this.userToken = localStorage.getItem('token');
        }else{
            this.userToken = '';
        }

        return this.userToken;
    }

    readRefreshToken(){
        if(localStorage.getItem('refreshToken')){
            this.userRefreshToken = localStorage.getItem('refreshToken');
        }else{
            this.userRefreshToken = '';
        }

        return this.userRefreshToken;
    }

    refreshToken() {
        // console.log("refrescando token");
        return this._http.post(
            `${this.url}token/refresh`, 
            {refresh: this.readRefreshToken()}
        ).pipe(
            map( resp => {
                // console.log(resp);
                this.saveToken(resp["refresh"], resp["access"]);
                this.startRefreshTokenTimer();
                return resp;
            },
            ));
    }

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.readToken().split('.')[1]));
        console.log(jwtToken);

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

}