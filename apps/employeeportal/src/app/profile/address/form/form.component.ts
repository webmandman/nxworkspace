import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../../../app/core/models/address';

@Component({
  selector: 'app-address-form',
  templateUrl: './form.component.html'
})
export class AddressFormComponent implements OnChanges {

  @Input() address: Address | null = null;
  @Output() addressSubmitted = new EventEmitter<Address>();

  addressForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.addressForm = formBuilder.group({
      address: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required]
    });
  }

  // address input is async so when it becomes it will populate the form
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.address) {
      this.addressForm.setValue(this.address);
    }
  }

  submitAddress(): void {
    this.addressSubmitted.emit(this.addressForm.value);
  }
}
