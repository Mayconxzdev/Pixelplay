import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class TabsComponent implements OnInit, OnDestroy {
  activeTab: string = 'home';
  private routerEvents: Subscription | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Atualiza a aba ativa quando a rota muda
    this.routerEvents = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateActiveTab(event.urlAfterRedirects || event.url || '');
    });
  }

  ngOnDestroy() {
    if (this.routerEvents) {
      this.routerEvents.unsubscribe();
    }
  }

  // Navega para a aba selecionada
  navigateTo(tab: string) {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.router.navigate([`/tabs/${tab}`], { replaceUrl: true });
    }
  }

  // Atualiza a aba ativa com base na URL
  private updateActiveTab(url: string) {
    if (url.includes('favorites')) {
      this.activeTab = 'favorites';
    } else if (url.includes('home') || url === '/tabs' || url === '/tabs/') {
      this.activeTab = 'home';
    }
  }
}
