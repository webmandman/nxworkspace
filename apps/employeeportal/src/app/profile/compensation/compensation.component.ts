import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Employee } from '../../../app/core/models/employee';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompStatement } from '../../../app/core/models/comp-statement';
import { UserService } from '../../../app/core/services/user.service';
import { IntlService } from '@progress/kendo-angular-intl';
import { LegendLabelsContentArgs } from '@progress/kendo-angular-charts';
import { SessionService } from '../../core/services/session.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogPasswordCheckComponent } from './password-check.component';

@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss']
})
export class CompensationComponent implements OnInit, OnDestroy {

  employee$: Subscription;
  employee?: Employee;
  employeeCompensationData?: CompStatement[];
  compensationGroups: { categoryuid?: string; category?: string }[] = [];
  year?: number;
  routeparams$?: Subscription;
  pieData: any[] = [];
  pieChartExlusionIDs = ['5719C325-1C7A-4EBA-85FB-29E92ABEA031', '8BC45014-A0C5-4CD7-A736-EF05CBE671E1'];
  authenticated = this.sessionService.getAuthenticated();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private sessionService: SessionService,
    private intl: IntlService,
    public dialog: MatDialog) {

    //Subscribe to route params
    this.routeparams$ = this.route.params.subscribe(params => {
      this.year = Number(params['year']);
    });

    //Get Authenticated Employee from Service
    this.employee$ = this.userService
      .getEmployeeInfo({ employeeid: this.sessionService.getLoggedInUser() })
      .pipe(map(response => response[0]))
      .subscribe(response => {
        this.employee = response;

        //Get Compensation Statement
        this.loadCompensation(this.year, this.employee?.employeeid);
      });
  }

  //On Init
  ngOnInit(): void {
    if (this.authenticated !== true) {
      this.openPasswordCheckDialog();
    }
  }

  //Customize Labels for Pie Chart
  labelContent(args: LegendLabelsContentArgs): string {
    return `${args.dataItem.category}: ${this.intl.formatNumber(args.dataItem.value, 'c2')}`;
  }

  //Get Compensation Statement Data
  loadCompensation(year?: number, employeeid?: number) {
    this.userService.getEmployeeCompStatement(year || 0, employeeid).pipe().subscribe(response => {
      //Assign Compensation Data to Array
      this.employeeCompensationData = response;

      //Add Distinct Categories into Categories Array
      for (const val of response) {
        const category = { category: val.title, value: val.amount, colorcode: val.colorcode };
        if (val.isheader === 1 && !this.pieChartExlusionIDs.includes(val.id)) {
          this.pieData.push(category);
        }
      }

      //Sort Pie Chart Data by Value
      this.pieData = this.pieData.sort((a, b) => b.value - a.value);

      //Bind Pie Chart Labels to Chart
      this.labelContent = this.labelContent.bind(this);
    });
  }

  // Open dialog and pass employee data into it
  openPasswordCheckDialog(year?: number, employee?: Employee): void {

    //Open Dialog
    const dialogRef = this.dialog.open(DialogPasswordCheckComponent, {
      data: {},
      hasBackdrop: true,
      backdropClass: 'ieblur',
      disableClose: true
    });

    //Close Dialog, Set Authenticated Session
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.sessionService.setAuthenticated(true);
        this.authenticated = true;
      }
    });
  }

  //On Destroy
  ngOnDestroy(): void {
    this.routeparams$?.unsubscribe();
    this.employee$?.unsubscribe();
  }

}
