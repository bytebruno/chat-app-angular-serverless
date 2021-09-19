import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { UserInformationService } from '../../services/user-information.service';
import { WebsocketManagementService } from '../../services/websocket-management.service';

@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss'],
})
export class ChatWrapperComponent implements OnInit {
  public message: { name: string; message: string } = {
    name: 'Bruno',
    message: '',
  };
  public messages: any = [];

  constructor(
    private wsService: WebsocketManagementService,
    private userInformationService: UserInformationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeWebsocketConnection().retrieveUserInformation();
  }

  public sendMessage() {
    this.wsService.send(this.message);
    this.message = { name: 'Bruno', message: '' };
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
    this.messages.push(msg);
    this.cd.detectChanges();
  }

  private retrieveUserInformation() {
    this.userInformationService
      .getOneUserInfo()
      .subscribe((x) => console.log('USER INFORMATION: ', x));
  }
}
