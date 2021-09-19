import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatWrapperComponent } from './components/chat-wrapper/chat-wrapper.component';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { NgModule } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@NgModule({
  declarations: [ChatWrapperComponent, MessageBoxComponent],
  imports: [
    AvatarModule,
    ButtonModule,
    CardModule,
    CommonModule,
    DialogModule,
    DividerModule,
    InputTextModule,
    MenuModule,
    PanelModule,
    ChatRoutingModule,
    ScrollPanelModule,
    FormsModule,
  ],
})
export class ChatModule {}
