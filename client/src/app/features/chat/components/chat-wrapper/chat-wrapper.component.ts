import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { UserInformationService } from '../../services/user-information.service';
import { WebsocketManagementService } from '../../services/websocket-management.service';

@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss'],
})
export class ChatWrapperComponent implements OnInit {
  @ViewChild('scp', { static: true }) scrollContainer: any;

  public showUpdateModal = false;

  public message: { name: string | undefined; message: string } = {
    name: 'Bruno',
    message: '',
  };
  public messages: any = [];
  public userInfo: any = { name: '', userId: '' };

  constructor(
    private wsService: WebsocketManagementService,
    private userInformationService: UserInformationService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeWebsocketConnection().retrieveUserInformation();
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (!isAuthenticated) this.router.navigateByUrl('/');
    });
    this.auth.user$.subscribe((user) => {
      console.log(user);
      this.userInfo.name = user?.name;
      this.message.name = this.userInfo.name;
      this.cd.detectChanges();
    });
  }

  public sendMessage() {
    this.wsService.send(this.message);
    this.message = { ...this.message, message: '' };
  }

  public saveUserInfo() {
    debugger;
    if (this.userInfo.userId === '') return;
    this.userInformationService
      .updateUserInfo(this.userInfo)
      .subscribe((userInfo: any) => {
        this.setUserInfoValues(userInfo);
      });
    this.showUpdateModal = false;
  }

  public logout() {
    this.auth.logout({ returnTo: 'http://localhost:4200' });
  }

  private initializeWebsocketConnection() {
    const wsSubject = this.wsService.connect();

    if (wsSubject) {
      wsSubject.subscribe(
        (msg: any) => this.processMessage(msg), // Called whenever there is a message from the server.
        (err: any) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
        () => console.log('complete') // Called when connection is closed (for whatever reason).
      );
    }
    return this;
  }

  private processMessage(msg: any) {
    console.log('Process message: ', msg);
    if (msg.name === this.userInfo.name) {
      msg.mine = true;
    }
    this.messages.push(msg);
    this.cd.detectChanges();
    console.log(this.scrollContainer.calculateContainerHeight());

    // this.scrollContainer.scrollTop = 100000;
    // debugger;
  }

  private retrieveUserInformation() {
    this.userInformationService.getOneUserInfo().subscribe((userInfo: any) => {
      this.setUserInfoValues(userInfo);
    });
  }

  private setUserInfoValues(userInfo: any) {
    this.userInfo = { ...this.userInfo, ...userInfo };
    this.message = { ...this.message, name: userInfo.name };
    this.cd.detectChanges();
  }
}
