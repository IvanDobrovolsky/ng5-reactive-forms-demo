import { AbstractControl, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/delay';

@Injectable()
export class UserProfileFormValidator {
  public readonly emailPattern = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';

  constructor(private http: Http) {
  }

  public numberInRange(min: number, max: number): any {
    return (control: FormControl): {[key: string]: boolean} => {
      const value = control.value;

      return (value < min || value > max) ? {invalidRange: true } : null;
    };
  }

  public validateEmailNotTaken(control: AbstractControl) {
    console.log('called');
    return this.checkEmail(control.value).map(res => {
      return res ? null : { emailTaken: true };
    });
  }

  private checkEmail(email: string) {
    console.log('http call');
    return this.http
      .get('./assets/users.json')
      .debounceTime(500)
      .delay(1000)
      .map(res => res.json())
      .map(users => {
        const user = users.find(item => item.email === email);

        console.log(user);

        return !user;
      });
  }
}
