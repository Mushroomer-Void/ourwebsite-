import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  
  readonly currentTheme = signal<ThemeMode>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme') as ThemeMode;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.currentTheme.set(savedTheme);
      }
      
      this.applyThemeClass(this.currentTheme());
    }

    effect(() => {
      const theme = this.currentTheme();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', theme);
        this.applyThemeClass(theme);
      }
    });
  }

  toggle(): void {
    this.currentTheme.update(theme => theme === 'light' ? 'dark' : 'light');
  }

  private applyThemeClass(theme: ThemeMode): void {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
