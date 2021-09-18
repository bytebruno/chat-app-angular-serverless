import { ChatRoutingModule } from './chat-routing.module';
import { ChatWrapperComponent } from './chat-wrapper/chat-wrapper.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ChatWrapperComponent],
  imports: [ChatRoutingModule, CommonModule],
})
export class ChatModule {}
