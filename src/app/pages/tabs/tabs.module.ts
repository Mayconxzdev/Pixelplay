import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabsComponent } from './tabs.component';
import { TabsRoutingModule } from './tabs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TabsRoutingModule,
    // Importa o TabsComponent como standalone
    TabsComponent
  ],
  declarations: [],
  exports: [TabsComponent]
})
export class TabsModule { }
