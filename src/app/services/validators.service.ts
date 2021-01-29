import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LatLng, Marker } from 'leaflet';
import { Observable } from 'rxjs';
import { Project } from '../models/project';
import { UserService } from './user.service';

interface ErrorValidate {
  [s: string]: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor(
    private userService: UserService
  ) { }

  public existeEmail = (control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate> => {

    return new Promise((resolve, reject) => {
      this.userService.emailDisponible(control.value).subscribe(
        resp => {
          // console.log(resp);
          if (resp.length > 0) {
            resolve({ existe: true });
          } else {
            resolve(null);
          }

        }
      );
    });
  }

  
  passwordMatch(passwordName: string, confirmPasswordName: string) {

    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[passwordName];
      const confirmPasswordControl = formGroup.controls[confirmPasswordName];

      if (passwordControl.value === confirmPasswordControl.value) {
        confirmPasswordControl.setErrors(null);
      } else {
        confirmPasswordControl.setErrors({ noMatchPassword: true });
      }

    }
  }

  entitiesAssociated(projectName: string, universitiesAssociatedName: string, 
    communitiesAssociated: string) {

    return (formGroup: FormGroup) => {
      const projectControl = formGroup.controls[projectName];
      const universitiesAssociatedControl = formGroup.controls[universitiesAssociatedName];
      const communitiesAssociatedControl = formGroup.controls[communitiesAssociated];

      if (projectControl.value > 0) {
        let universityHasError = false;
        let communityHasError = false;
        if(universitiesAssociatedControl.value == null){
          universityHasError = true;
        }else if(universitiesAssociatedControl.value.length == 0 ){
          universityHasError = true;
        }

        if(communitiesAssociatedControl.value == null){
          communityHasError = true;
        }else if(communitiesAssociatedControl.value.length == 0 ){
          communityHasError = true;          
        }

        if(universityHasError && communityHasError){
          universitiesAssociatedControl.setErrors({ noEntityAssociated: true });
          communitiesAssociatedControl.setErrors({ noEntityAssociated: true });
        }else{
          universitiesAssociatedControl.setErrors(null);
        communitiesAssociatedControl.setErrors(null);
        }
        

        
        
      } else {
        universitiesAssociatedControl.setErrors(null);
        communitiesAssociatedControl.setErrors(null);
      }

    }
  }

  typeInvestigator(independentInvestigator: string, university: string) {
      return (formGroup: FormGroup) => {
        const independentInvestigatorControl = formGroup.controls[independentInvestigator];
        const universityControl = formGroup.controls[university];

        if(!independentInvestigatorControl.value && universityControl.value == null){
          universityControl.setErrors({ noUniversitySelected: true });
        }else {
          universityControl.setErrors(null);
        }

        // if(independentInvestigatorControl.value && !mark2Moved){
        //   independentInvestigatorControl.setErrors({ noLocationEstablished: true });
        // }
        // else{
        //   independentInvestigatorControl.setErrors(null);
        // }
      }
      
    }


}