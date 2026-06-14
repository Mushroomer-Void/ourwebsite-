import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMockService, AdminReport } from '@core/api/mock/admin.mock.service';

@Component({
  selector: 'app-admin-reports',
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  public adminService = inject(AdminMockService);

  activeTab = signal<'pending'|'resolved'|'dismissed'>('pending');
  filterType = signal<'all'|'product'|'shop'|'user'>('all');
  selectedReport = signal<AdminReport | null>(null);
  showDetailModal = signal(false);

  totalReports = computed(() => this.adminService.reports().length);
  pendingReports = computed(() => this.adminService.reports().filter(r => r.status === 'pending').length);
  resolvedReports = computed(() => this.adminService.reports().filter(r => r.status === 'resolved').length);
  dismissedReports = computed(() => this.adminService.reports().filter(r => r.status === 'dismissed').length);

  filteredReports = computed(() => {
    let reports = this.adminService.reports();
    
    if (this.activeTab() === 'pending') {
      reports = reports.filter(r => r.status === 'pending');
    } else if (this.activeTab() === 'resolved') {
      reports = reports.filter(r => r.status === 'resolved');
    } else if (this.activeTab() === 'dismissed') {
      reports = reports.filter(r => r.status === 'dismissed');
    }
    
    if (this.filterType() !== 'all') {
      reports = reports.filter(r => r.targetType === this.filterType());
    }
    
    return reports;
  });

  openDetail(report: AdminReport) {
    this.selectedReport.set(report);
    this.showDetailModal.set(true);
  }

  closeDetail() {
    this.showDetailModal.set(false);
  }

  resolve() {
    const rep = this.selectedReport();
    if (rep) {
      this.adminService.resolveReport(rep.id);
      this.closeDetail();
    }
  }

  dismiss() {
    const rep = this.selectedReport();
    if (rep) {
      this.adminService.dismissReport(rep.id);
      this.closeDetail();
    }
  }
}
