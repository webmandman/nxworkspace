import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Phone } from '../../../../app/core/models/phone';
import { PhoneNumberValidationService } from '../../../../app/shared/utils/phonenumber-validation.service';

@Component({
  selector: 'app-phone-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class PhoneFormComponent implements OnChanges {

  @Input() phone: Phone | null = null;
  @Output() cellSubmitted = new EventEmitter<Phone>();

  cellForm: FormGroup;
  controls: Record<string, AbstractControl>;
  requiredMessage: string;
  invalidMessage: string;
  phoneNumberMask: string;

  constructor(
    private location: Location,
    formBuilder: FormBuilder,
    private phonenumberValidator: PhoneNumberValidationService) {
    this.cellForm = formBuilder.group({
      cellnumber: ['', Validators.compose([
        Validators.required,
        this.phonenumberValidator.patternValidator()
      ])]
    });
    this.controls = this.cellForm.controls;
    this.requiredMessage = phonenumberValidator.requiredMessage;
    this.invalidMessage = phonenumberValidator.invalidMessage;
    this.phoneNumberMask = phonenumberValidator.phoneNumberMask;
  }

  // address input is async so when it becomes it will populate the form
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['phone'] && this.phone) {
      this.cellForm.setValue(this.phone);
    }
  }
  submitCellnumber(): void {
    this.cellSubmitted.emit(this.cellForm.value);
  }

  cancel(): void {
    this.location.back();
  }

}
