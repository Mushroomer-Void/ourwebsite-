import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthMockService } from '@core/api/mock/auth.mock.service';
import { ProductMockService } from '@core/api/mock/product.mock.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  private router = inject(Router);
  public authService = inject(AuthMockService);
  public productService = inject(ProductMockService);

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;
  role = this.authService.role;
  isMobileMenuOpen = signal(false);
  showUserMenu = signal(false);
  showNotifications = signal(false);
  searchQuery = signal('');
  showSearch = signal(false);

  notifications = signal([
    { id: 1, message: 'مرحباً بك في السوق الليبي!', time: 'الآن', read: false, icon: 'fas fa-store' },
    { id: 2, message: 'اكتشف أحدث المنتجات', time: 'منذ دقيقة', read: false, icon: 'fas fa-box' }
  ]);

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isMobileMenuOpen.set(false);
      }
    });
  }

  goToLogin() { this.router.navigate(['/auth/login']); }
  goToRegister() { this.router.navigate(['/auth/register']); }
  goToProfile() { this.router.navigate(['/profile']); }
  goToMerchant() { this.router.navigate(['/merchant']); }
  goToAdmin() { this.router.navigate(['/admin']); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.showUserMenu.set(false);
  }

  markAllRead() {
    this.notifications.update(ns => ns.map(n => ({...n, read: true})));
  }

  onSearch() {
    if (this.searchQuery()) {
      this.router.navigate(['/products'], { queryParams: { q: this.searchQuery() } });
      this.showSearch.set(false);
    }
  }

  updateSearch(v: string) {
    this.searchQuery.set(v);
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
    this.showNotifications.set(false);
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    this.showUserMenu.set(false);
  }

  closeAll() {
    this.showUserMenu.set(false);
    this.showNotifications.set(false);
    this.showSearch.set(false);
  }
}
