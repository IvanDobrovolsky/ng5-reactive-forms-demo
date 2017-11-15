import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';
import { UserProfileFormValidator } from './user-profile-form/user-profile-form.validator';
import { ApiService } from './api.service';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [
    ApiService,
    UserProfileFormValidator
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
