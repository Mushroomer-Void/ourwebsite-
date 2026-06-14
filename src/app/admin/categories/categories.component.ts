import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminMockService, AdminCategory } from '@core/api/mock/admin.mock.service';

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  public adminService = inject(AdminMockService);
  
  categories = this.adminService.categories;
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  selectedCategory = signal<AdminCategory | null>(null);

  openEdit(cat: AdminCategory) {
    this.selectedCategory.set({...cat});
    this.showEditModal.set(true);
  }

  openDelete(cat: AdminCategory) {
    this.selectedCategory.set(cat);
    this.showDeleteModal.set(true);
  }

  saveEdit() {
    const selected = this.selectedCategory();
    if (selected) {
      this.adminService.updateCategory(selected.id, selected);
      this.showEditModal.set(false);
    }
  }

  confirmDelete() {
    const selected = this.selectedCategory();
    if (selected) {
      this.adminService.deleteCategory(selected.id);
      this.showDeleteModal.set(false);
    }
  }

  updateEditField(field: string, value: string) {
    this.selectedCategory.update(c => c ? {...c, [field]: value} : c);
  }

  viewShops(cat: AdminCategory) {
    console.log('عرض متاجر التصنيف:', cat.nameAr);
  }
}
