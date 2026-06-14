import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantMockService } from '@core/api/mock/merchant.mock.service';

@Component({
  selector: 'app-merchant-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  private merchantService = inject(MerchantMockService);

  activeTab = signal<'pending'|'completed'|'cancelled'>('pending');

  pendingOrders = computed(() => this.merchantService.pendingOrders());
  completedOrders = computed(() => this.merchantService.completedOrders());
  cancelledOrders = computed(() => this.merchantService.cancelledOrders());

  currentOrders = computed(() => {
    const tab = this.activeTab();
    if (tab === 'pending') return this.pendingOrders();
    if (tab === 'completed') return this.completedOrders();
    return this.cancelledOrders();
  });

  updateStatus(id: number, status: 'pending'|'completed'|'cancelled'): void {
    this.merchantService.updateOrderStatus(id, status);
  }
}
