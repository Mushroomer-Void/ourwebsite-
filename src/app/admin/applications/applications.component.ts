import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminMockService, AdminApplication } from '@core/api/mock/admin.mock.service';

@Component({
  selector: 'app-admin-applications',
  imports: [CommonModule, FormsModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {
  public adminService = inject(AdminMockService);
  private router = inject(Router);

  activeTab = signal<'pending'|'approved'|'rejected'>('pending');
  selectedApp = signal<AdminApplication | null>(null);
  showDetailModal = signal(false);
  adminNote = signal('');
  showRejectForm = signal(false);

  currentApps = computed(() => {
    const apps = this.adminService.applications();
    if (this.activeTab() === 'pending') return apps.filter(a => a.status === 'pending');
    if (this.activeTab() === 'approved') return apps.filter(a => a.status === 'approved');
    return apps.filter(a => a.status === 'rejected');
  });

  pendingCount = computed(() => this.adminService.applications().filter(a => a.status === 'pending').length);
  approvedCount = computed(() => this.adminService.applications().filter(a => a.status === 'approved').length);
  rejectedCount = computed(() => this.adminService.applications().filter(a => a.status === 'rejected').length);

  openDetail(app: AdminApplication) {
    this.selectedApp.set(app);
    this.adminNote.set(app.adminNote || '');
    this.showDetailModal.set(true);
  }

  closeDetail() {
    this.showDetailModal.set(false);
    this.showRejectForm.set(false);
    this.adminNote.set('');
    this.selectedApp.set(null);
  }

  updateAdminNote(val: string) {
    this.adminNote.set(val);
  }

  approve() {
    const app = this.selectedApp();
    if (app) {
      this.adminService.approveApplication(app.id, this.adminNote());
      this.closeDetail();
    }
  }

  reject() {
    const app = this.selectedApp();
    if (app) {
      this.adminService.rejectApplication(app.id, this.adminNote());
      this.closeDetail();
    }
  }
}
