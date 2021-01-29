import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'], 
  providers: [UserService]
})
export class ProfileComponent implements OnInit {
  public user: User;
  public idUser: number;

  constructor(
    private userService: UserService, 
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idUser = +params['id'];
    });
this.getUser();
  }

  getUser(){
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Loading User...',

    });
    Swal.showLoading();
    this.userService.getInfoUser(this.idUser).subscribe(resp => {
      
this.user = resp;
Swal.close();
    }, 
    (err) => {
      Swal.fire({
        icon: 'error', 
        title: 'Error', 
        text: err
        
      });
    })
  }

}
