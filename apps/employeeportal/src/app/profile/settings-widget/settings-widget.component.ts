import { Component, Input } from '@angular/core';
import { WIDGET, IWidget } from '@psomas/shared/ui/widget-wrapper';
import { ApiResponse } from '../../../app/core/models/api.response';
import { Employee } from '../../../app/core/models/employee';

@Component({
  selector: 'app-settings-widget',
  templateUrl: './settings-widget.component.html',
  styleUrls: ['./settings-widget.component.scss'],
  providers: [
    { provide: WIDGET, useExisting: SettingsWidgetComponent }
  ]
})
export class SettingsWidgetComponent implements IWidget {

  @Input() employee: Employee | null = null;
  title = 'My Settings';

  settingUpdated(response: ApiResponse) {
    console.log(response);
  }

}
