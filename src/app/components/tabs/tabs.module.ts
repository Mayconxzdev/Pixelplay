import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabsComponent } from './tabs.component';
import { TabsRoutingModule } from './tabs-routing.module';

@NgModule({
  declarations: [TabsComponent],
  imports: [
    CommonModule,
    IonicModule,
    TabsRoutingModule
  ],
  exports: [TabsComponent]
})
export class TabsModule { }
