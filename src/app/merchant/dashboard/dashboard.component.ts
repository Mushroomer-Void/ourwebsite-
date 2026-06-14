import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthMockService } from '@core/api/mock/auth.mock.service';
import { MerchantMockService, MerchantOrder } from '@core/api/mock/merchant.mock.service';

@Component({
  selector: 'app-merchant-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthMockService);
  merchantService = inject(MerchantMockService);
  private router = inject(Router);

  shopInfo = this.merchantService.shopInfo;
  recentActivity = this.merchantService.recentActivity;

  currentDate = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  animatedStats = signal({ products: 0, pending: 0, completed: 0, followers: 0 });
  mounted = signal(false);

  activeBottomTab = signal<'activity'|'reviews'|'notifications'>('activity');

  reviews = signal([
    { id: 1, buyer: 'أحمد محمد', product: 'عسل طبيعي', rating: 5, comment: 'منتج ممتاز جداً', date: 'منذ يومين' },
    { id: 2, buyer: 'فاطمة علي', product: 'زيت أرغان', rating: 4, comment: 'جيد لكن التوصيل تأخر', date: 'منذ أسبوع' },
    { id: 3, buyer: 'خالد سالم', product: 'صابون طبيعي', rating: 5, comment: 'سأطلب مرة أخرى بالتأكيد', date: 'منذ أسبوعين' }
  ]);
  
  notifications = signal([
    { id: 1, type: 'season', message: 'موسم التخرج قادم — جهّز منتجاتك!', time: 'منذ ساعة', read: false },
    { id: 2, type: 'order', message: 'طلب جديد من مريم حسن', time: 'منذ 3 ساعات', read: true },
    { id: 3, type: 'review', message: 'تقييم جديد 5 نجوم على عسل طبيعي', time: 'منذ يوم', read: true }
  ]);

  topProducts = computed(() => 
    this.merchantService.products()
      .sort((a, b) => b.ordersCount - a.ordersCount)
      .slice(0, 3)
  );

  orderChartData = computed(() => {
    const pending = this.merchantService.pendingOrders().length;
    const completed = this.merchantService.completedOrders().length;
    const cancelled = this.merchantService.cancelledOrders().length;
    return {
      pending,
      completed,
      cancelled,
      total: this.merchantService.orders().length || 1
    };
  });

  completedPercent = computed(() => 
    Math.round(this.merchantService.completedOrders().length / (this.merchantService.orders().length || 1) * 100)
  );
  pendingPercent = computed(() =>
    Math.round(this.merchantService.pendingOrders().length / (this.merchantService.orders().length || 1) * 100)
  );
  cancelledPercent = computed(() =>
    Math.round(this.merchantService.cancelledOrders().length / (this.merchantService.orders().length || 1) * 100)
  );

  totalSales = computed((): number => {
    return this.merchantService.completedOrders()
      .reduce((sum: number, order: MerchantOrder) => sum + order.price, 0);
  });

  averageOrderValue = computed((): number => {
    const completed = this.merchantService.completedOrders().length;
    return completed > 0 ? Math.round(this.totalSales() / completed) : 0;
  });

  ngOnInit() {
    setTimeout(() => this.mounted.set(true), 100);

    const stats = this.merchantService.stats();
    this.animateNumber(stats.productsCount, 'products');
    this.animateNumber(stats.pendingOrders, 'pending');
    this.animateNumber(stats.completedOrders, 'completed');
    this.animateNumber(stats.followersCount, 'followers');
  }

  animateNumber(target: number, key: keyof ReturnType<typeof this.animatedStats>) {
    if (target === 0) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      this.animatedStats.update(s => ({ ...s, [key]: current }));
      if (current >= target) clearInterval(interval);
    }, 40);
  }

  goToProducts() { this.router.navigate(['/merchant/products']); }
  
  goToOrders(tab: string) { 
    this.router.navigate(['/merchant/orders'], { queryParams: { tab } }); 
  }

  goToFollowers() { this.router.navigate(['/merchant/followers']); }

  refreshActivity() {
    this.merchantService.recentActivity.update(activities => [
      { id: Date.now(), type: 'view', message: 'تم تحديث النشاطات', time: 'الآن' },
      ...activities.slice(0, 4)
    ]);
  }

  getRatingArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
