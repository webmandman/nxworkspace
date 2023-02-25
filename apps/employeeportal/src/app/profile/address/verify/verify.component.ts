import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Address } from '../../../../app/core/models/address';

@Component({
  selector: 'app-address-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class AddressVerifyComponent implements OnChanges {

  @Input() address: Address | null = null;
  @Output() verified = new EventEmitter<boolean>();
  public addressLine = '';

  constructor(private location: Location) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.address) {
      this.addressLine = `${this.address.address} ${this.address.address2} `;
      this.addressLine += `${this.address.city} ${this.address.state} ${this.address.zipcode}`;
    }
  }

  onVerifyFail(): void {
    this.verified.emit(false);
  }

  verify(): void {
    this.verified.emit(true);
  }
}
