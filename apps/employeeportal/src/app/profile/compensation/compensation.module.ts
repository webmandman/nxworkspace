import { NgModule } from '@angular/core';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { PackagesModule } from '../../packages.module';
import { CompensationRoutingModule } from './compensation-routing.module';
import { CompensationComponent } from './compensation.component';
import { DialogPasswordCheckComponent } from './password-check.component';

@NgModule({
    declarations: [
        CompensationComponent,
        DialogPasswordCheckComponent
    ],
    imports: [
        PackagesModule,
        CompensationRoutingModule,
        ChartsModule
    ]
})
export class CompensationModule { }
