import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthMockService } from '../../core/api/mock/auth.mock.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  private router = inject(Router);
  authService = inject(AuthMockService);

  sidebarOpen = signal(true);
  
  isMerchant = computed(() => this.authService.role() === 'merchant');
  isAdmin = computed(() => this.authService.role() === 'admin');
  
  // router.url isn't a signal, so we use a getter to keep it reactive in the template
  get activeRoute() {
    return this.router.url;
  }

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
