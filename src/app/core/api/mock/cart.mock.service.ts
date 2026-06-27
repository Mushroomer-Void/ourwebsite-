import { Injectable, signal, computed } from '@angular/core';
import { HomeProduct } from './product.mock.service';

export interface CartItem {
  id: number;
  name: string;
  shopName: string;
  shopId: number;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartMockService {

  cartItems = signal<CartItem[]>([]);

  totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0));

  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) =>
      sum + (item.discountPrice ?? item.price) * item.quantity, 0));

  addToCart(product: HomeProduct): void {
    const existing = this.cartItems()
      .find(item => item.id === product.id);
    if (existing) {
      this.cartItems.update(items =>
        items.map(item => item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item));
    } else {
      this.cartItems.update(items => [...items, {
        id: product.id,
        name: product.name,
        shopName: product.shopName,
        shopId: product.shopId,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.image,
        quantity: 1
      }]);
    }
  }

  removeFromCart(id: number): void {
    this.cartItems.update(items =>
      items.filter(item => item.id !== id));
  }

  updateQuantity(id: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }
    this.cartItems.update(items =>
      items.map(item => item.id === id
        ? { ...item, quantity }
        : item));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  isInCart(id: number): boolean {
    return this.cartItems().some(item => item.id === id);
  }

  getItemsByShop = computed(() => {
    const grouped: Record<number, CartItem[]> = {};
    this.cartItems().forEach(item => {
      if (!grouped[item.shopId]) grouped[item.shopId] = [];
      grouped[item.shopId].push(item);
    });
    return grouped;
  });
}
