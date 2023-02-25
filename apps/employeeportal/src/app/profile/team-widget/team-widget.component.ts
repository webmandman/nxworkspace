import { Component, Input } from '@angular/core';
import { WIDGET, IWidget } from '@psomas/shared/ui/widget-wrapper';
import { Employee } from '../../../app/core/models/employee';

@Component({
  selector: 'app-team-widget',
  templateUrl: './team-widget.component.html',
  styleUrls: ['./team-widget.component.scss'],
  providers: [
    { provide: WIDGET, useExisting: TeamWidgetComponent }
  ]
})
export class TeamWidgetComponent implements IWidget {

  @Input() employee: Employee | null = null;
  public title = 'My Team';

  public isKPG(employee: Employee): boolean {
    if (employee.emailaddress.indexOf("@kpg.com") !== -1) return true;
    return false;
  }
}
