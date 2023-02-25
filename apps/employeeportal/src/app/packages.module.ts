import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'hammerjs';



const modules = [
  CommonModule,
  HttpClientModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule
];

@NgModule({
  imports: [],
  exports: modules
})
export class PackagesModule { }
