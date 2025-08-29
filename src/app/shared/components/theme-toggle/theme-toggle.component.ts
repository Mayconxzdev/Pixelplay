import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  isDark = false;
  private themeSubscription: Subscription | null = null;

  constructor(private themeService: ThemeService) {
    console.log('ThemeToggleComponent: constructor');
  }

  ngOnInit() {
    console.log('ThemeToggleComponent: ngOnInit');
    this.isDark = this.themeService.isDarkMode();
    console.log('ThemeToggleComponent: Initial isDark:', this.isDark);
    
    // Atualiza o estado quando o tema for alterado por outro componente
    this.themeSubscription = this.themeService.onThemeChange().subscribe({
      next: (isDark) => {
        console.log('ThemeToggleComponent: Theme changed to:', isDark ? 'dark' : 'light');
        this.isDark = isDark;
      },
      error: (error) => {
        console.error('ThemeToggleComponent: Error in theme subscription:', error);
      }
    });
  }

  async toggleTheme(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      await this.themeService.toggleTheme();
    } catch (error) {
      console.error('Error toggling theme:', error);
      this.isDark = this.themeService.isDarkMode();
    }
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
