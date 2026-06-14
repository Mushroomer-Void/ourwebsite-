import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AdminMockService } from '@core/api/mock/admin.mock.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  providers: [DatePipe]
})
export class AdminDashboardComponent implements OnInit {
  adminService = inject(AdminMockService);
  private router = inject(Router);

  stats = this.adminService.stats;
  recentActivity = this.adminService.recentActivity;
  pendingApplications = this.adminService.pendingApplications;
  pendingReports = this.adminService.pendingReports;

  animatedStats = signal({ buyers: 0, merchants: 0, products: 0, orders: 0 });

  currentDate = new Date();

  // نسب الـ Chart
  buyersPercent = computed(() => 
    Math.round(this.stats().totalBuyers / 
    (this.stats().totalBuyers + this.stats().totalMerchants) * 100)
  );

  merchantsPercent = computed(() => 
    Math.round(this.stats().totalMerchants / 
    (this.stats().totalBuyers + this.stats().totalMerchants) * 100)
  );

  // نسب الطلبات
  pendingPercent = computed(() =>
    Math.round(this.adminService.applications().filter(a => a.status === 'pending').length /
    (this.adminService.applications().length || 1) * 100)
  );

  approvedPercent = computed(() =>
    Math.round(this.adminService.applications().filter(a => a.status === 'approved').length /
    (this.adminService.applications().length || 1) * 100)
  );

  rejectedPercent = computed(() =>
    Math.round(this.adminService.applications().filter(a => a.status === 'rejected').length /
    (this.adminService.applications().length || 1) * 100)
  );

  approvedApplicationsCount = computed(() => this.adminService.applications().filter(a => a.status === 'approved').length);
  rejectedApplicationsCount = computed(() => this.adminService.applications().filter(a => a.status === 'rejected').length);

  ngOnInit() {
    this.animateNumber(this.stats().totalBuyers, 'buyers');
    this.animateNumber(this.stats().totalMerchants, 'merchants');
    this.animateNumber(this.stats().totalProducts, 'products');
    this.animateNumber(this.stats().totalOrders, 'orders');
  }

  animateNumber(target: number, key: keyof ReturnType<typeof this.animatedStats>) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      this.animatedStats.update(s => ({ ...s, [key]: current }));
      if (current >= target) {
        clearInterval(interval);
      }
    }, 50);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
