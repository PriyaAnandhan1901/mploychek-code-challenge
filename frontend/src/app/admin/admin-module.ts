import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { UserManagement } from './user-management/user-management';

@NgModule({
  declarations: [UserManagement],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
