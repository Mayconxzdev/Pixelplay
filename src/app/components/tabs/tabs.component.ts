import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class TabsComponent {
  activeTab: string = 'home';

  constructor() {}

  setActiveTab(event: any) {
    this.activeTab = event.tab;
  }
}
