import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '@auth0/auth0-angular';
import { IMessage } from '../../models/iMessage';
import { IUploadUrlResponse } from '../../models/iUploadUrlResponse';
import { IUserInfo } from '../../models/iUserInfo';
import { Router } from '@angular/router';
import { UserInformationService } from '../../services/user-information.service';
import { WebsocketManagementService } from '../../services/websocket-management.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss'],
})
export class ChatWrapperComponent implements OnInit {
  @ViewChild('scp', { static: true }) scrollContainer: any;

  public showUpdateModal = false;
  public fileToUpload: File | null = null;

  public message: IMessage = {
    name: '',
    message: '',
    avatarUrl: '',
  };
  public messages: IMessage[] = [];
  public userInfo: IUserInfo = { name: '', userId: '', avatarUrl: '' };

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

  public saveUserInfo(uploader: any) {
    if (this.userInfo.userId === '') return;

    if (this.fileToUpload) {
      this.userInformationService
        .getUploadUrl()
        .pipe(
          mergeMap((res: IUploadUrlResponse) =>
            this.userInformationService.uploadFile(
              res.uploadUrl,
              this.fileToUpload
            )
          ),
          mergeMap(() => {
            return this.userInformationService.updateUserInfo(this.userInfo);
          })
        )
        .subscribe((userinfo: IUserInfo) => {
          this.setUserInfoValues(userinfo);
          uploader.clear();
        });
    } else {
      this.userInformationService
        .updateUserInfo(this.userInfo)
        .subscribe((userInfo: any) => {
          this.setUserInfoValues(userInfo);
        });
    }

    this.showUpdateModal = false;
  }

  public logout() {
    this.auth.logout({ returnTo: 'http://localhost:4200' });
  }

  public handleFileSelect(files: any) {
    this.fileToUpload = files[0];
  }

  public handleFileRemove() {
    this.fileToUpload = null;
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

  private processMessage(msg: IMessage) {
    console.log('Process message: ', msg);
    if (msg.name === this.userInfo.name) {
      msg.isMine = true;
    }
    this.messages.push(msg);
    this.cd.detectChanges();

    this.scrollContainer.scrollTop(
      this.scrollContainer.contentViewChild.nativeElement.scrollHeight
    );
  }

  private retrieveUserInformation() {
    this.userInformationService
      .getOneUserInfo()
      .subscribe((userInfo: IUserInfo) => {
        this.setUserInfoValues(userInfo);
      });
  }

  private setUserInfoValues(userInfo: IUserInfo) {
    this.userInfo = { ...this.userInfo, ...userInfo };
    this.message = {
      ...this.message,
      name: userInfo.name ?? this.message.name,
      avatarUrl: userInfo.avatarUrl ?? this.message.avatarUrl,
    };
    this.cd.detectChanges();
  }
}
