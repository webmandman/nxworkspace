import { Injectable } from '@angular/core';
import { Address } from '../../core/models/address';
import { SmartyService } from '../../core/services/smarty.service';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SmartyResponse } from '../../../app/core/models/smarty.response';

@Injectable({
  providedIn: 'root'
})

export class VerifyService {

  constructor(
    private smartyService: SmartyService
  ) { }

  public verifyAddress(address: Address): Observable<boolean> {
    return this.smartyService.getSingleAddress(address)
      .pipe(
        switchMap(response => of(this.isValidAddress(response)))
      );
  }

  private isValidAddress(res: SmartyResponse[]): boolean {
    if (
      res.length &&
      res[0].analysis['active'] === 'Y' &&
      res[0].analysis['dpv_match_code'] === 'Y'
    ) {
      return true;
    } else {
      return false;
    }
  }
}
