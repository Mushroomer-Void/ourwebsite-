import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminMockService, AdminUser } from '@core/api/mock/admin.mock.service';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  public adminService = inject(AdminMockService);
  private router = inject(Router);

  activeTab = signal<'all'|'buyers'|'merchants'|'banned'>('all');
  searchQuery = signal('');
  selectedUser = signal<AdminUser | null>(null);
  showProfileModal = signal(false);
  showConfirmModal = signal(false);

  // Quick stats
  totalUsers = computed(() => this.adminService.users().length);
  totalBuyers = computed(() => this.adminService.users().filter(u => u.role === 'buyer').length);
  totalMerchants = computed(() => this.adminService.users().filter(u => u.role === 'merchant').length);
  totalBanned = computed(() => this.adminService.users().filter(u => u.status === 'banned').length);

  filteredUsers = computed(() => {
    let users = this.adminService.users();
    
    if (this.activeTab() === 'buyers') {
      users = users.filter(u => u.role === 'buyer');
    } else if (this.activeTab() === 'merchants') {
      users = users.filter(u => u.role === 'merchant');
    } else if (this.activeTab() === 'banned') {
      users = users.filter(u => u.status === 'banned');
    }

    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    
    return users;
  });

  openProfile(user: AdminUser) {
    this.selectedUser.set(user);
    this.showProfileModal.set(true);
  }

  closeProfile() {
    this.showProfileModal.set(false);
  }

  confirmToggle(user: AdminUser) {
    this.selectedUser.set(user);
    this.showConfirmModal.set(true);
  }

  cancelToggle() {
    this.showConfirmModal.set(false);
  }

  executeToggle() {
    const user = this.selectedUser();
    if (user) {
      this.adminService.toggleUserStatus(user.id);
      
      // Update selectedUser if profile modal is open so it reflects the new status
      if (this.showProfileModal()) {
         const updatedUser = this.adminService.users().find(u => u.id === user.id);
         if (updatedUser) {
           this.selectedUser.set(updatedUser);
         }
      }
    }
    this.showConfirmModal.set(false);
  }

  updateSearch(v: string) {
    this.searchQuery.set(v);
  }
}
