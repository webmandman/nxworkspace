import { Component, Input } from '@angular/core';
import { WIDGET, IWidget } from '@psomas/shared/ui/widget-wrapper';

@Component({
  selector: 'app-portfolio-widget',
  templateUrl: './portfolio-widget.component.html',
  styleUrls: ['./portfolio-widget.component.scss'],
  providers: [
    { provide: WIDGET, useExisting: PortfolioWidgetComponent }
  ]
})
export class PortfolioWidgetComponent implements IWidget {

  @Input() hasstock: boolean | null = null;

  public title = 'My Portfolio';

}
