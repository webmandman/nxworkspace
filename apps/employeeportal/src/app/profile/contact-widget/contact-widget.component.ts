import { Component, Input } from '@angular/core';
import { WIDGET } from '@psomas/shared/ui/widget-wrapper';
import { ChangeRequest } from '../../../app/core/models/change-request';
import { Employee } from '../../../app/core/models/employee';
import { IWidget } from '@psomas/shared/ui/widget-wrapper';

@Component({
  selector: 'app-contact-widget',
  templateUrl: './contact-widget.component.html',
  styleUrls: ['./contact-widget.component.scss'],
  providers: [
    { provide: WIDGET, useExisting: ContactWidgetComponent }
  ]
})
export class ContactWidgetComponent implements IWidget {

  @Input() employee: Employee | null = null;

  public title = 'My Contact Information';
  public phoneChangeEnabled = true;
  public addressChangeEnabled = true;


  togglePhoneChangeOption(pending: ChangeRequest[]): void {
    if (pending.length) {
      this.phoneChangeEnabled = false;
    }
  }
  toggleAddressChangeOption(pending: ChangeRequest[]): void {
    if (pending.length) {
      this.addressChangeEnabled = false;
    }
  }

}
