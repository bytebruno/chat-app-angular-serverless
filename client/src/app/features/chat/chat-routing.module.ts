import { RouterModule, Routes } from '@angular/router';

import { ChatWrapperComponent } from './components/chat-wrapper/chat-wrapper.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: ChatWrapperComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
