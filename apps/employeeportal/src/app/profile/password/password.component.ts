import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../../../app/core/services/user.service';
import { PasswordValidationService } from '../../../app/shared/utils/password-validation.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnDestroy{

  @ViewChild('stepper', {static: true}) stepper: StepperComponent | null = null;
  public currentStep = 0;
  public steps = [
    {label: 'Password'},
    {label: 'Done'}
  ];
  passwordForm: FormGroup;
  submitted = false;
  requiredMessage: string;
  invalidPasswordMessage: string;
  requiredConfirmMessage: string;
  invalidMismatchMessage: string;
  subs: Subscription[] = [];

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private passwordValidator: PasswordValidationService,
    private userService: UserService
  ) {
    this.requiredMessage = passwordValidator.requiredMessage;
    this.invalidPasswordMessage = passwordValidator.invalidPasswordMessage;
    this.requiredConfirmMessage = passwordValidator.requiredConfirmMessage;
    this.invalidMismatchMessage = passwordValidator.invalidMismatchMessage;
    this.passwordForm = this.fb.group({
      password: ['', Validators.compose([
        Validators.required,
        this.passwordValidator.patternValidator()
      ])],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: [this.passwordValidator.matchPassword('password', 'confirmPassword')],
    }
    );
  }

  get passwordFormControl() {
    return this.passwordForm.controls;
  }

  savePassword(): void {
    this.submitted = true;
    this.subs.push(
      this.userService.updateUserPassword(this.passwordForm.value.password).subscribe(
        res => this.next()
      )
    );
  }

  public next(): void{
    if (this.currentStep !== this.steps.length){
      this.currentStep += 1;
    }
  }

  public prev(): void{
    if (this.currentStep !== 0){
      this.currentStep -= 1;
    }
  }

  cancel(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
