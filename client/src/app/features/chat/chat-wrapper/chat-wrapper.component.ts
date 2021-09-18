import { Component, OnInit } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

import { WebsocketManagementService } from '../websocket-management.service';

@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss'],
})
export class ChatWrapperComponent implements OnInit {
  constructor(private wsService: WebsocketManagementService) {}

  ngOnInit(): void {
    const wsSubject = this.wsService.connect();

    if (wsSubject) {
      wsSubject.subscribe(
        (msg: any) => console.log('message received: ' + msg), // Called whenever there is a message from the server.
        (err: any) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
        () => console.log('complete') // Called when connection is closed (for whatever reason).
      );
    }
  }
}
