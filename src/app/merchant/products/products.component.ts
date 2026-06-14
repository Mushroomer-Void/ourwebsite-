import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchantMockService, Product } from '@core/api/mock/merchant.mock.service';

@Component({
  selector: 'app-merchant-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private merchantService = inject(MerchantMockService);

  products = this.merchantService.products;
  
  showAddForm = signal(false);
  showEditForm = signal(false);
  selectedProduct = signal<Product | null>(null);
  showDeleteConfirm = signal(false);
  productToDelete = signal<number | null>(null);

  newProduct = signal({
    name: '', 
    description: '', 
    price: 0,
    discountPrice: undefined as number | undefined,
    categoryId: 1, 
    images: [] as string[], 
    shopId: 1,
    rating: 0, 
    ordersCount: 0, 
    inWishlist: false
  });

  categories = signal([
    { id: 1, name: 'جمال وعناية' },
    { id: 2, name: 'الأطعمة والمأكولات' },
    { id: 3, name: 'الأشغال اليدوية' },
    { id: 4, name: 'الأزياء والموضة' }
  ]);

  getCategoryName(id: number): string {
    return this.categories().find(c => c.id === id)?.name || 'غير معروف';
  }

  // للمنتج الجديد:
  updateNewName(v: string) { this.newProduct.update(p => ({...p, name: v})); }
  updateNewDesc(v: string) { this.newProduct.update(p => ({...p, description: v})); }
  updateNewPrice(v: number) { this.newProduct.update(p => ({...p, price: v})); }
  updateNewDiscount(v: number) { this.newProduct.update(p => ({...p, discountPrice: v})); }
  updateNewCategory(v: number) { this.newProduct.update(p => ({...p, categoryId: v})); }

  // للمنتج المحدد (تعديل):
  updateEditName(v: string) { this.selectedProduct.update(p => p ? {...p, name: v} : p); }
  updateEditDesc(v: string) { this.selectedProduct.update(p => p ? {...p, description: v} : p); }
  updateEditPrice(v: number) { this.selectedProduct.update(p => p ? {...p, price: v} : p); }
  updateEditDiscount(v: number) { this.selectedProduct.update(p => p ? {...p, discountPrice: v} : p); }
  updateEditCategory(v: number) { this.selectedProduct.update(p => p ? {...p, categoryId: v} : p); }

  openAddForm(): void {
    this.newProduct.set({
      name: '', description: '', price: 0,
      discountPrice: undefined, categoryId: 1,
      images: [], shopId: 1, rating: 0, ordersCount: 0, inWishlist: false
    });
    this.showAddForm.set(true);
  }

  closeAddForm(): void {
    this.showAddForm.set(false);
  }

  openEditForm(product: Product): void {
    this.selectedProduct.set({ ...product });
    this.showEditForm.set(true);
  }

  closeEditForm(): void {
    this.showEditForm.set(false);
    this.selectedProduct.set(null);
  }

  confirmDelete(id: number): void {
    this.productToDelete.set(id);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.productToDelete.set(null);
  }

  saveNewProduct(): void {
    this.merchantService.addProduct(this.newProduct());
    this.closeAddForm();
  }

  saveEditProduct(): void {
    const p = this.selectedProduct();
    if (p) {
      this.merchantService.updateProduct(p.id, p);
    }
    this.closeEditForm();
  }

  deleteProduct(): void {
    const id = this.productToDelete();
    if (id !== null) {
      this.merchantService.deleteProduct(id);
    }
    this.cancelDelete();
  }
}
