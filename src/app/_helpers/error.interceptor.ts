import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

/*
Http error interceptor works with the calling service and the API's
It intercepts the responses from the API and check for the status codes (if there were any errors).
Error Status 401: Unauthorized Response - the user will be automatically logged out
All other errors are RE-THROWN to be caught by the calling service so an alert can be displayed to the user 
 */

 @Injectable()
 export class ErrorInterceptor implements HttpInterceptor{
     constructor(private authService: AuthService){}

     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(request)
        .pipe(
            catchError(err => {
                console.log(err);

                if(err.status === 401 && (!request.url.endsWith('token') && !request.url.endsWith('account'))){
                    // auto logout on unauthorized response
                    console.log("Se produjó un error 401");
                    this.authService.logout();
                    window.location.reload();
                }

                const error = err.error.message || err.statusText;
                return throwError(err);

            })
        )
     }

}