import { Component, Input, OnInit } from '@angular/core';

import { IMessage } from '../../models/iMessage';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
})
export class MessageBoxComponent implements OnInit {
  @Input() message: IMessage;

  constructor() {
    this.message = { avatarUrl: '', name: '', message: '' };
  }

  ngOnInit(): void {}
}
