import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../app/core/services/user.service';
import { SessionService } from '../../../app/core/services/session.service';
import { Employee } from '../../../app/core/models/employee';
import { ApiResponse } from '../../../app/core/models/api.response';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnDestroy {

  croppedImage = '';
  employee: Observable<Employee>;
  subs: Subscription[] = [];
  photo: Observable<string>;

  constructor(
    private userService: UserService,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.employee = this.userService
      .getEmployeeInfo({ employeeid: this.sessionService.getLoggedInUser() })
      .pipe(map((response) => response[0]));
    this.photo = this.employee.pipe(map(emp => emp.profileimage));
    console.log(this.photo)
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  cancel(): void {
    this.router.navigateByUrl('/profile');
  }

  saveCroppedImage(image: string): void {
    this.croppedImage = image;
    this.subs.push(this.userService
      .saveCroppedImage(this.croppedImage)
      .subscribe(
        (response: ApiResponse) => {
          if (response.data.STATUS === 'ok') {
            this.router.navigateByUrl('/profile');
          }
        }
      ));
  }

}
