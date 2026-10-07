import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './dashboard/dashboard';

@NgModule({
  declarations: [Dashboard],
  imports: [CommonModule, RouterModule, DashboardRoutingModule],
})
export class DashboardModule {}