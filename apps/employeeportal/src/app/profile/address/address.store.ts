import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Address } from '../../../app/core/models/address';
import { SessionService } from '../../../app/core/services/session.service';
import { UserService } from '../../../app/core/services/user.service';

@Injectable()
export class AddressStore {

  /**
   * State
   */

  // Address State
  private addrSource = new ReplaySubject<Address>(1);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public address = this.addrSource.asObservable();

  /**
   * Dependencies
   */
  constructor(
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  /**
   * State Services
   */

  // Update
  updateAddress(address: Address){
    this.addrSource.next(address);
  }

  // Get Address, initial address value
  getSavedAddress(): void{
     this.userService
      .getEmployeeInfo({employeeid:this.sessionService.getLoggedInUser()})
      .pipe(
        tap( (response) => {
          const address: Address = {
            address: response[0].address,
            address2: response[0].address2,
            city: response[0].city,
            state: response[0].state,
            zipcode: response[0].zip
          };
          this.updateAddress(address);
        })
      )
      .subscribe();
  }

}
