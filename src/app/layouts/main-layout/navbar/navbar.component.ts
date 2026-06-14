import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  private router = inject(Router);
  
  isMobileMenuOpen = signal(false);

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isMobileMenuOpen.set(false);
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }
}
