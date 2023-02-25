import { NgModule } from '@angular/core';
import { PackagesModule } from '../../../packages.module';
import { ProfileChangeRequestsComponent } from './profile-change-requests.component';
import { PhonePipe } from '../../../shared/pipes/phone.pipe';



@NgModule({
  declarations: [ProfileChangeRequestsComponent],
  imports: [PackagesModule],
  exports: [ProfileChangeRequestsComponent],
  providers: [PhonePipe]
})
export class ProfileChangeRequestsModule { }
