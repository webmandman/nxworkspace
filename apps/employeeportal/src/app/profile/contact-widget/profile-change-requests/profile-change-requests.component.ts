import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiResponse } from '../../../../app/core/models/api.response';
import { ChangeRequest } from '../../../../app/core/models/change-request';
import { Employee } from '../../../../app/core/models/employee';
import { ChangeRequestsService } from '../../../../app/core/services/change-requests.service';
import { PhonePipe } from '../../../../app/shared/pipes/phone.pipe';

@Component({
  selector: 'app-profile-change-requests',
  templateUrl: './profile-change-requests.component.html',
  styleUrls: ['./profile-change-requests.component.scss']
})
export class ProfileChangeRequestsComponent implements OnInit{

  @Input() type: string | null = null;
  @Input() employeenumber: number | null = null;
  @Output() pending = new EventEmitter<ChangeRequest[]>();

  public requests: Observable<ChangeRequest[]> | null = null;

  constructor(
    private requestService: ChangeRequestsService,
    private phonePipe: PhonePipe
  ) {}

  ngOnInit(): void {
    this.requests = this.requestService.getByEmployeeId()
      .pipe(
        map(reqs => reqs.data.filter( (r: ChangeRequest) => r.cr_type === this.type)),
        tap( reqs => this.pending.emit(reqs) )
      );
  }

  parseJson(jsonString: string, requestType: string): string{
    const obj = JSON.parse(jsonString);
    if ( requestType === 'address' ){
      return obj.address + ' ' + obj.address2 + ' ' + obj.city + ' ' + obj.state + ' ' + obj.zipcode;
    }else{
      return this.phonePipe.transform(obj.cellnumber);
    }
  }
}
