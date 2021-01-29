import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [AuthService]
})
export class SigninComponent implements OnInit {
    signInForm = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')]), 
    password : new FormControl('', Validators.required),
  });

  // @Input() modalActive: boolean;
  // @Output() eventSignInModalClose = new EventEmitter<boolean>();


  

  constructor(
    private _authService: AuthService, 
    private router: Router
  ) {
    // this.modalActive = false;
   }

  ngOnInit(): void {
    this.scrollToForm();
  }

  onSubmit(){

    if(this.signInForm.invalid){

      return Object.values( this.signInForm.controls ).forEach( control => {
        
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
        
        
      });

    }

    console.log(this.signInForm);
    let user: User = this.signInForm.value;

    Swal.fire({
      allowOutsideClick: false, 
      icon: 'info', 
      text: 'Iniciando Sesión...', 
      
    });

    Swal.showLoading();

    this._authService.singIn(user)
    .subscribe(
      resp => {
        Swal.close();
        console.log(resp);
        this.signInForm.reset();
        
        window.location.href = '/project';
        
      }, 
      (err) => {
        console.log(err);
        if(err.error){
          Swal.fire({
            icon: 'error', 
            title: 'Error', 
            text: err.error.detail, 
            
          });
          
        }
        
      }
    );
    
  }

  closeModal(){
    // this.modalActive = false;
    // this.eventSignInModalClose.emit(true);
  }

  scrollToForm(){
    let element = document.querySelector("#contSignInForm");
    element.scrollIntoView({ behavior: 'smooth', block: 'start'});
  }

}
