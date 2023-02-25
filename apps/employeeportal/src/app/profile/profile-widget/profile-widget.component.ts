import { Component, Input } from '@angular/core';
import { WIDGET, IWidget } from '@psomas/shared/ui/widget-wrapper';
import { Employee } from '../../../app/core/models/employee';


@Component({
  selector: 'app-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss'],
  providers: [
    { provide: WIDGET, useExisting: ProfileWidgetComponent }
  ]
})
export class ProfileWidgetComponent implements IWidget {

  @Input() employee: Employee | null = null;

  public title = 'My Personal Information';

  public isKPG(employee: Employee): boolean {
    if (employee.emailaddress.indexOf("@kpg.com") !== -1) return true;
    return false;
  }
}
