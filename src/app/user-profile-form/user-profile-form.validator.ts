import { AbstractControl, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/delay';

import { ApiService } from '../api.service';

@Injectable()
export class UserProfileFormValidator {
  public readonly emailPattern = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';

  constructor(private apiService: ApiService) {
  }

  public numberInRange(min: number, max: number): any {
    return (control: FormControl): {[key: string]: boolean} => {
      const value = control.value;

      return (value < min || value > max) ? {invalidRange: true } : null;
    };
  }

  public validateEmailNotTaken(control: AbstractControl) {
    return this.checkEmail(control.value).map(res => {
      return res ? null : { emailTaken: true };
    });
  }

  private checkEmail(email: string) {
    return this.apiService
      .getUsers()
      .debounceTime(500)
      .delay(1000)
      .map(users => {
        const user = users.find(item => item.email === email);

        return !user;
      });
  }
}
