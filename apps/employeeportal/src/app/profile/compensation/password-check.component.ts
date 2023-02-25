import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../../app/core/services/user.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from '../../../app/core/services/session.service';

// Password Check Dialog____________________________________________________>
@Component({
  selector: 'app-password-check-component',
  templateUrl: './password-check.component.html',
  styleUrls: ['./password-check.component.scss']
})
export class DialogPasswordCheckComponent implements OnDestroy {

  authentication$?: Subscription;
  searchString: FormControl = new FormControl('');
  form?: FormGroup;
  data?: any;
  authenticated = this.sessionService.getAuthenticated();
  showAuthenticationError = false;
  invalidcount = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogPasswordCheckComponent>,
    public router: Router,
    private userService: UserService,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.data = data;
  }

  // Clear password field if Escape or Delete keys are pressed
  checkDelete(event: KeyboardEvent): void {
    if (event.code === 'Delete' || event.code === 'Escape') {
      this.searchString.setValue('');
    }
  }

  //Authenticate User
  authenticateUser(password: string): void {
    //Get Authenticated Employee from Service
    this.authentication$ = this.userService
      .authenticateEmployee(this.sessionService.getLoggedInUser(), password)
      .pipe(map(response => response[0]))
      .subscribe(response => {
        //[IF] Authenticate Successful, show compensation [ELSE] Show invalid password message
        if (response.statuscode === 'SUCCESS') {
          this.authenticated = true;
          this.displayCompensation();
        } else {
          this.searchString.setErrors({ invalid: true });
          this.invalidcount++;
        }
      });
  }

  //Display Compensation Statement
  displayCompensation(): void {
    this.dialogRef.close(this.authenticated);
  }

  //Exit to Previous Page in History
  exit(event: MouseEvent) {
    this.dialogRef.close(this.authenticated);
    this.router.navigate(['./profile']);
  }

  //Navigate to Reset Password Page
  resetPassword(event: MouseEvent): void {
    this.dialogRef.close(this.authenticated);
    this.router.navigate(['./profile/password']);
  }

  //OnDestroy Method
  ngOnDestroy() {
    this.authentication$?.unsubscribe();
  }

}
