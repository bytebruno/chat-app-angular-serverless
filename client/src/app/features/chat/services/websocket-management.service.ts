import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { webSocket } from 'rxjs/webSocket';

export const WS_ENDPOINT = environment.websocketUrl;

@Injectable({
  providedIn: 'root',
})
export class WebsocketManagementService {
  constructor() {}

  private subject: any;

  public connect(): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = webSocket(WS_ENDPOINT);
      console.log('Successfully connected: ' + WS_ENDPOINT);
    }
    return this.subject;
  }

  public send(message: any) {
    this.subject.next({
      action: 'sendMessage',
      name: message.name,
      message: message.message,
    });
  }
}
