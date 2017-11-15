import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Operators
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { Subscription } from 'rxjs/Subscription';

import { Gender, User } from '../models/user.model';
import { UserProfileFormValidator } from './user-profile-form.validator';
import { Observable } from 'rxjs/Observable';

/**
 Validators:
   firstName - required, capitalized, a-z
   lastName - required, capitalized, a-z
   email - required, email pattern
   gender - required
   birthday: {
     day - required, number from 1 to 31
     month - required, number from 1 to 12
     year - required, number from 1900 to the current year
   }

   // JavaScript APIs
   FormGroup -> 'user'
       FormControl -> 'firstName'
       FormControl -> 'lastName'
       FormControl -> 'email'
       FormControl -> 'gender'
       FormGroup -> 'birthday'
           FormControl -> 'day'
           FormControl -> 'month'
           FormControl -> 'year'

   // DOM bindings
   formGroup -> 'user'
       formControlName -> 'firstName'
       formControlName -> 'lastName'
       formControlName -> 'email'
       formControlName -> 'gender'
       formGroupName -> 'birthday'
           formControlName -> 'day'
           FormControlName -> 'month'
           FormControlName -> 'year'

 */


@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.less']
})
export class UserProfileFormComponent implements OnInit, OnDestroy {
  public user: FormGroup;
  public readonly currentDay = new Date().getDate();
  public readonly currentMonth = new Date().getMonth() + 1;
  public readonly currentYear = new Date().getFullYear();
  private formSubscription: Subscription;

  constructor (private fb: FormBuilder, private customValidator: UserProfileFormValidator) {
  }

  public ngOnInit(): void {
    this.user = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(10)]],
      lastName: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [
          Validators.required,
          Validators.pattern(this.customValidator.emailPattern)
        ],
        this.customValidator.validateEmailNotTaken.bind(this.customValidator)
      ],
      gender: [Gender[Gender.male], [Validators.required]],
      birthday: this.fb.group({
        day: ['', [Validators.required, this.customValidator.numberInRange(1, 31)]],
        month: ['', [Validators.required, this.customValidator.numberInRange(1, 12)]],
        year: ['', [Validators.required, this.customValidator.numberInRange(1900, this.currentYear)]]
      })
    });

    const toLowerCase = (char: string): string => char.toLowerCase();
    const isTextCharacter = (char: string): boolean => /^[a-zA-Z\s]+$/.test(char) && !!char;
    const toApiEndpoint = (char: string): string => `http://apiurl/${char}`;
    const makeFakeHttpRequest = (url: string): Observable<string> =>
      Observable.of(JSON.stringify({status: 200, message: 'Success!', data: { user: true }}, null, 3));

    // Simple example of how reactivity works
    this.formSubscription = this.user.get('firstName').valueChanges
      .debounceTime(500)
      .filter(isTextCharacter)
      .map(toLowerCase)
      .map(toApiEndpoint)
      .switchMap(makeFakeHttpRequest)
      .subscribe(value => {
        console.log(`Retrieved from fake server : ${value}`);
      });
  }

  public ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  public submit (): void {
    if (this.user.valid) {
      const userFormData: User = this.user.value;

      console.log(userFormData, 'Submitted!');
    }
  }
}
