import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterLink,
    RouterLinkActive
  ]
})
export class TabsComponent implements OnInit {
  activeTab: string = 'home';

  constructor(private router: Router) {}

  ngOnInit() {
    // Atualiza a aba ativa quando a rota muda
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (url.includes('home')) {
        this.activeTab = 'home';
      } else if (url.includes('favorites')) {
        this.activeTab = 'favorites';
      }
    });
  }

  setActiveTab(event: any) {
    this.activeTab = event.tab || this.activeTab;
  }
}
