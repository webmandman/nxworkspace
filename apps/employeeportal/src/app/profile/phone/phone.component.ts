import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Phone } from '../../../app/core/models/phone';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { SmsService } from '../../../app/core/services/sms.service';
import { CodeGeneratorService } from '../../../app/shared/utils/code-generator.service';
import { map, tap } from 'rxjs/operators';
import { UserService } from '../../../app/core/services/user.service';
import { SessionService } from '../../../app/core/services/session.service';
import { ChangeRequestsService } from '../../../app/core/services/change-requests.service';
import { ApiResponse } from '../../../app/core/models/api.response';
import { PhoneNumberValidationService } from '../../../app/shared/utils/phonenumber-validation.service';


@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
  providers: [CodeGeneratorService]
})

export class PhoneComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true }) stepper!: StepperComponent;
  public currentStep = 0;
  public steps = [
    { label: 'Mobile Phone' },
    { label: 'Verification Code' },
    { label: 'Done' }
  ];
  public title = 'Change Cellphone Number';
  public old: Phone | null = null;
  public oldphone: Observable<Phone> | undefined;
  public newphone: Phone | undefined;
  public coordinates: Observable<string> | undefined;
  public smsResponse: Observable<ApiResponse> | undefined;
  public invalid: boolean | undefined;
  public code: string;
  public verification = false;
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private smsService: SmsService,
    private codeGenerator: CodeGeneratorService,
    private userService: UserService,
    private sessionService: SessionService,
    private changeRequestsService: ChangeRequestsService,
    private phoneValidator: PhoneNumberValidationService
  ) {
    this.code = this.codeGenerator.generate();
  }

  ngOnInit(): void {
    this.oldphone = this.userService
      .getEmployeeInfo({ employeeid: this.sessionService.getLoggedInUser() })
      .pipe(
        map(response => {
          const phone: Phone = {
            cellnumber: response[0].cellnumber.trim()
          };
          // remove all non digits
          phone.cellnumber = phone.cellnumber.replace(/\D+/g, '');
          if (this.route.snapshot.queryParams['code'] && this.validatePhoneNumber(phone.cellnumber)) {
            this.title = 'Verify Cellphone Number';
            this.verification = true;
            this.cellSubmitted(phone);
          }
          return phone;
        })
      );
    this.subs.push(this.oldphone.subscribe(phone => this.old = phone));
  }

  // This method is called everytime the user clicks the form submit button
  public cellSubmitted(phone: Phone): void {
    this.newphone = phone;
    const message = `${this.code} is your Psomas verification code.`;
    this.smsResponse = this.smsService.sendMessage(phone.cellnumber, message)
      .pipe(
        tap((response: ApiResponse) => {
          // TODO: handler other status codes
          if (response.data[0].statusCode === '201') {
            this.next();
          } else {
            this.invalid = true;
          }
        })
      );
    this.subs.push(this.smsResponse.subscribe());
  }

  public onVerify(submitted: boolean): void {
    if (submitted && this.old && this.newphone) {
      // TODO: handle possibly errors from http
      this.subs.push(this.userService.updatePolicyById().subscribe());
      this.next();
    } else {
      this.router.navigate(['profile']);
    }
  }

  public onChangeRequest(submitted: boolean): void {
    if (submitted && this.old && this.newphone) {
      // TODO: handle possibly errors from http
      this.subs.push(this.changeRequestsService.addPhoneChangeRequest(this.old, this.newphone).subscribe());
      this.next();
    } else {
      this.router.navigate(['profile']);
    }
  }

  public nextStep(verified: boolean): void {
    if (verified) {
      this.next();
    } else {
      this.prev();
    }
  }

  public next(): void {
    if (this.currentStep !== this.steps.length) {
      this.currentStep += 1;
    }
  }

  public prev(): void {
    if (this.currentStep !== 0) {
      this.currentStep -= 1;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  validatePhoneNumber(phonenumber: string): boolean {
    const regex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/);
    const valid = regex.test(phonenumber);
    return valid ? true : false;
  }

}
