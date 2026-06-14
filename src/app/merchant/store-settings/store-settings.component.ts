import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchantMockService } from '@core/api/mock/merchant.mock.service';

@Component({
  selector: 'app-merchant-store-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './store-settings.component.html',
  styleUrl: './store-settings.component.scss'
})
export class StoreSettingsComponent {
  private merchantService = inject(MerchantMockService);

  shopInfo = this.merchantService.shopInfo;
  isOpen = computed(() => this.shopInfo().isOpen);

  formData = signal({ ...this.shopInfo() });

  showCloseModal = signal(false);
  closeReason = signal('');
  closedUntil = signal('');
  saved = signal(false);
  socialError = signal(false);

  updateField(field: string, value: string): void {
    this.formData.update(data => ({ ...data, [field]: value }));
  }

  updateSocialLink(platform: string, value: string): void {
    this.formData.update(data => ({
      ...data,
      socialLinks: { ...data.socialLinks, [platform as keyof typeof data.socialLinks]: value }
    }));
  }

  saveSettings(): void {
    const links = this.formData().socialLinks;
    const hasSocial = Object.values(links).some(v => v && v.trim() !== '');
    
    if (!hasSocial) {
      this.socialError.set(true);
      return;
    }
    
    this.socialError.set(false);
    this.merchantService.updateShopInfo(this.formData());
    this.saved.set(true);
    
    setTimeout(() => {
      this.saved.set(false);
    }, 3000);
  }

  toggleShop(): void {
    if (this.isOpen()) {
      this.closeReason.set('');
      this.closedUntil.set('');
      this.showCloseModal.set(true);
    } else {
      this.merchantService.toggleShopStatus(true);
    }
  }

  confirmClose(): void {
    this.merchantService.toggleShopStatus(false, this.closeReason(), this.closedUntil());
    this.showCloseModal.set(false);
  }
  
  cancelClose(): void {
    this.showCloseModal.set(false);
  }
}
