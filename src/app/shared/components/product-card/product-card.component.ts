import { Component, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HomeProduct } from '@core/api/mock/product.mock.service';
import { AuthMockService } from '@core/api/mock/auth.mock.service';
import { CartMockService } from '@core/api/mock/cart.mock.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  private router = inject(Router);
  private authService = inject(AuthMockService);
  cartService = inject(CartMockService);

  product = input.required<HomeProduct>();
  wishlistToggle = output<number>();
  productClick = output<number>();
  loginRequired = output<void>();

  isInCart = computed(() => {
    const id = this.product()?.id;
    return id ? this.cartService.isInCart(id) : false;
  });

  addToCart(event: Event): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.loginRequired.emit();
      return;
    }
    this.cartService.addToCart(this.product());
  }

  onWishlistClick(event: Event): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.loginRequired.emit();
      return;
    }
    this.wishlistToggle.emit(this.product().id);
  }

  onProductClick(): void {
    this.productClick.emit(this.product().id);
  }

  getStars(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  getCategoryName(id: number): string {
    const map: Record<number, string> = {
      1: 'جمال وعناية',
      2: 'الأطعمة والمأكولات', 
      3: 'الأشغال اليدوية',
      4: 'الأزياء والموضة'
    };
    return map[id] || '';
  }
}
