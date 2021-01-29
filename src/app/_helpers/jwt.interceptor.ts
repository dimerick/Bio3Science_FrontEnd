import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from '../services/auth.service';

/*
The JWT interceptor intercepts the incoming requests from the application/user and adds JWT token to the request's Authorization header, only if the user is logged in.
This JWT token in the request header is required to access the SECURE END API POINTS on the server 
*/

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    constructor(private authservice: AuthService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        // check if the current user is logged in
        // if the user making the request is logged in, he will have JWT token in it's local storage, which is set by Authorization Service during login process
        let token = localStorage.getItem('token');
        //let toke = '123';
        // if(token == null){
        //     location.reload(true);
        // }
        
        if(token){
            // clone the incoming request and add JWT token in the cloned request's Authorization Header
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`, 
                }
            });

            console.log(request);
        }

        // handle any other requests which went unhandled
        return next.handle(request);
    }
}