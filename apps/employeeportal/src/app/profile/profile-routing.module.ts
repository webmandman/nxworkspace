import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagesModule } from '../packages.module';
import { ProfileComponent } from './profile.component';

const profileRoutes: Routes = [
  { path: '', component: ProfileComponent }
];

@NgModule({
  declarations: [],
  imports: [
    PackagesModule,
    RouterModule.forChild(profileRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileRoutingModule { }
