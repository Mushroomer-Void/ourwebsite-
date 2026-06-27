import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductMockService } from '@core/api/mock/product.mock.service';
import { AuthMockService } from '@core/api/mock/auth.mock.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoginPromptComponent } from '../../../shared/components/login-prompt/login-prompt.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, LoginPromptComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  productService = inject(ProductMockService);
  authService = inject(AuthMockService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  allProducts = this.productService.products;
  categories = this.productService.categories;
  showLoginPrompt = signal(false);

  searchQuery = signal('');
  selectedCategory = signal<number | null>(null);
  sortBy = signal<'trending'|'newest'|'price-low'|'price-high'|'rating'>('trending');

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
      if (params['category']) {
        this.selectedCategory.set(Number(params['category']));
      }
    });
  }

  filteredProducts = computed(() => {
    let products = this.allProducts();
    if (this.selectedCategory()) {
      products = products.filter(p => p.categoryId === this.selectedCategory());
    }
    if (this.searchQuery()) {
      products = products.filter(p =>
        p.name.includes(this.searchQuery()) ||
        p.shopName.includes(this.searchQuery()) ||
        p.description.includes(this.searchQuery())
      );
    }
    switch (this.sortBy()) {
      case 'trending': return [...products].sort((a,b) => b.ordersCount - a.ordersCount);
      case 'newest': return [...products].filter(p => p.isNew);
      case 'price-low': return [...products].sort((a,b) => (a.discountPrice??a.price) - (b.discountPrice??b.price));
      case 'price-high': return [...products].sort((a,b) => (b.discountPrice??b.price) - (a.discountPrice??a.price));
      case 'rating': return [...products].sort((a,b) => b.rating - a.rating);
      default: return products;
    }
  });

  updateSearch(v: string) {
    this.searchQuery.set(v);
  }

  selectCategory(id: number | null) {
    this.selectedCategory.set(id);
  }

  toggleWishlist(id: number) {
    if (!this.authService.isLoggedIn()) {
      this.showLoginPrompt.set(true);
      return;
    }
    this.productService.toggleWishlist(id);
  }

  goToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }
}
