import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthMockService } from '@core/api/mock/auth.mock.service';
import { ProductMockService } from '@core/api/mock/product.mock.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  authService = inject(AuthMockService);
  productService = inject(ProductMockService);
  themeService = inject(ThemeService);
  router = inject(Router);

  currentUser = this.authService.currentUser;
  role = this.authService.role;
  
  wishlist = computed(() =>
    this.productService.products().filter(p => p.inWishlist)
  );

  activeTab = signal<'profile'|'wishlist'|'orders'|'settings'>('profile');

  orders = signal([
    { id: 1, productName: 'عسل جبلي طبيعي', shopName: 'متجر الطبيعة', price: 70, date: '2024-06-01', status: 'completed' },
    { id: 2, productName: 'زيت أرغان مغربي', shopName: 'متجر الطبيعة', price: 120, date: '2024-06-10', status: 'pending' },
    { id: 3, productName: 'عباءة فاخرة', shopName: 'أزياء ليبيا', price: 200, date: '2024-06-15', status: 'cancelled' }
  ]);

  pendingOrders = computed(() => this.orders().filter(o => o.status === 'pending'));
  completedOrders = computed(() => this.orders().filter(o => o.status === 'completed'));
  cancelledOrders = computed(() => this.orders().filter(o => o.status === 'cancelled'));

  ordersTab = signal<'all'|'pending'|'completed'|'cancelled'>('all');
  
  currentOrders = computed(() => {
    if (this.ordersTab() === 'pending') return this.pendingOrders();
    if (this.ordersTab() === 'completed') return this.completedOrders();
    if (this.ordersTab() === 'cancelled') return this.cancelledOrders();
    return this.orders();
  });

  editMode = signal(false);
  editName = signal('');
  
  startEdit() {
    this.editName.set(this.currentUser()?.name ?? '');
    this.editMode.set(true);
  }
  
  saveEdit() {
    this.editMode.set(false);
  }
  
  updateEditName(v: string) {
    this.editName.set(v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  removeFromWishlist(id: number) {
    this.productService.toggleWishlist(id);
  }
}
