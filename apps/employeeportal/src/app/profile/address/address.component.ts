import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { VerifyService } from './verify.service';
import { Address } from '../../core/models/address';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { skipWhile, switchMap, tap } from 'rxjs/operators';
import { ChangeRequestsService } from '../../../app/core/services/change-requests.service';
import { AddressStore } from './address.store';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})

export class AddressComponent implements OnInit,OnDestroy{
  @ViewChild('stepper', {static: false}) stepper: StepperComponent | null = null;
  public currentStep = 0;
  public steps = [
    {label: 'Address'},
    {label: 'Verify'},
    {label: 'Done'}
  ];
  public oldaddress: Address | null = null;
  public old: Address | null = null;
  public newaddress: Address | null = null;
  public addressLine = '';
  public coordinates: Observable<string> | null = null;
  public verifyResponse: Observable<boolean> | null = null;
  public invalid: boolean | null = null;
  private subs: Subscription[] = [];

  constructor(
    private addrStore: AddressStore,
    private verifyService: VerifyService,
    private changeRequestsService: ChangeRequestsService
  ) {
  }

  ngOnInit(): void{
    this.addrStore.getSavedAddress();
    this.addrStore.address
      .pipe(
        skipWhile((address, i) => {
          if(i === 0){
            this.oldaddress = address;
            this.addressLine = this.addressToString(address);
            return true;
          }
          return false;
        }),
        switchMap((address: Address) => this.verifyService.verifyAddress(address)
          .pipe(
            tap( (valid: boolean) => valid ? this.next() : this.invalid = true )
          ))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  // This method is called everytime the user clicks the form submit button
  public addressSubmitted(address: Address): void{
    this.newaddress = address;

    // store the single line string version
    const str = this.addressToString(address);
    this.addressLine = str;

    // Add submitted address to Address State stream
    this.addrStore.updateAddress(address);
  }

  public startChangeRequest(verified: boolean): void{
    if (verified && this.oldaddress && this.newaddress){
      this.subs.push(this.changeRequestsService.addAddressChangeRequest(this.oldaddress, this.newaddress).subscribe());
      this.next();
    }else{
      this.prev();
    }
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

  private addressToString(address: Address): string{
    return `${address.address} ${address.address2} ${address.city} ${address.state} ${address.zipcode}`;
  }


}
