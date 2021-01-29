import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css']
})
export class RecoveryPasswordComponent implements OnInit {

  recoveryForm = new FormGroup({
    email : new FormControl('ericksaenz37@outlook.com', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')])
  });

  constructor() { }

  ngOnInit(): void {
  }
  
  onSubmit(){
    console.log(this.recoveryForm);
  }

}
