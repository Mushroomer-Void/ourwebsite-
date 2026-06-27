import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartMockService, CartItem } from '@core/api/mock/cart.mock.service';
import { ProductMockService } from '@core/api/mock/product.mock.service';
import { AuthMockService } from '@core/api/mock/auth.mock.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartService = inject(CartMockService);
  productService = inject(ProductMockService);
  authService = inject(AuthMockService);
  router = inject(Router);

  cartItems = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;
  totalPrice = this.cartService.totalPrice;
  itemsByShop = this.cartService.getItemsByShop;

  shopNames = computed(() => {
    const names: Record<number, string> = {};
    this.cartService.cartItems().forEach(item => {
      names[item.shopId] = item.shopName;
    });
    return names;
  });

  shopKeys = computed(() => Object.keys(this.itemsByShop()).map(Number));

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  updateQty(id: number, qty: number) {
    this.cartService.updateQuantity(id, qty);
  }

  getShopItems(shopId: number): CartItem[] {
    return this.itemsByShop()[shopId] ?? [];
  }

  getShopTotal(shopId: number): number {
    return this.getShopItems(shopId)
      .reduce((sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity, 0);
  }

  contactShop(shopId: number) {
    const shop = this.productService.shops().find(s => s.id === shopId);
    if (shop?.socialLinks.whatsapp) {
      window.open('https://wa.me/' + shop.socialLinks.whatsapp, '_blank');
    } else if (shop?.socialLinks.instagram) {
      window.open('https://instagram.com/' + shop.socialLinks.instagram, '_blank');
    }
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
