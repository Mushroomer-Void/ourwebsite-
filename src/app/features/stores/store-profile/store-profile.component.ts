import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductMockService, HomeProduct } from '@core/api/mock/product.mock.service';
import { CartMockService } from '@core/api/mock/cart.mock.service';
import { AuthMockService } from '@core/api/mock/auth.mock.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoginPromptComponent } from '../../../shared/components/login-prompt/login-prompt.component';

@Component({
  selector: 'app-store-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, LoginPromptComponent],
  templateUrl: './store-profile.component.html',
  styleUrl: './store-profile.component.scss'
})
export class StoreProfileComponent implements OnInit {
  productService = inject(ProductMockService);
  cartService = inject(CartMockService);
  authService = inject(AuthMockService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  shopId = signal<number>(0);
  shop = computed(() => this.productService.shops().find(s => s.id === this.shopId()));
  shopProducts = computed(() => this.productService.products().filter(p => p.shopId === this.shopId()));
  isFollowing = signal(false);
  showLoginPrompt = signal(false);

  ngOnInit() {
    this.route.params.subscribe(p => this.shopId.set(+p['id']));
  }

  toggleFollow() {
    if (!this.authService.isLoggedIn()) {
      this.showLoginPrompt.set(true);
      return;
    }
    this.isFollowing.update(v => !v);
  }

  addToCart(product: HomeProduct) {
    if (!this.authService.isLoggedIn()) {
      this.showLoginPrompt.set(true);
      return;
    }
    this.cartService.addToCart(product);
  }

  goToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  getCategoryName(id: number): string {
    const map: Record<number, string> = {
      1: 'جمال وعناية',
      2: 'الأطعمة والمأكولات',
      3: 'الأشغال اليدوية',
      4: 'الأزياء والموضة'
    };
    return map[id] ?? '';
  }
}
