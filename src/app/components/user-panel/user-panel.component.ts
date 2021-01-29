import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'], 
  providers: [AuthService]
})
export class UserPanelComponent implements OnInit {
  @Input() panelActive: boolean;
  @Output() eventUserPanelClose = new EventEmitter<boolean>();
  @Input() currentUser: User;
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;
  constructor(
    private _authservice: AuthService
  ) { 
    this.panelActive = true;
  }

  ngOnInit(): void {
    
  }

  closePanel(){
    this.panelActive = false;
    this.eventUserPanelClose.emit(true);
  }

  logout(){
    this._authservice.logout();
  }


}
