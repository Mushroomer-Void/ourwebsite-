import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminMockService, AdminSeason } from '@core/api/mock/admin.mock.service';

@Component({
  selector: 'app-admin-seasons',
  imports: [CommonModule, FormsModule],
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss'
})
export class SeasonsComponent {
  public adminService = inject(AdminMockService);
  
  seasons = this.adminService.seasons;
  showAddModal = signal(false);
  selectedSeason = signal<AdminSeason | null>(null);
  showDetailModal = signal(false);

  availableCategories = [
    { id: 'beauty', nameAr: 'جمال وعناية', icon: 'fas fa-spa' },
    { id: 'food', nameAr: 'الأطعمة والمأكولات', icon: 'fas fa-utensils' },
    { id: 'handmade', nameAr: 'الأشغال اليدوية', icon: 'fas fa-hands' },
    { id: 'fashion', nameAr: 'الأزياء والموضة', icon: 'fas fa-tshirt' }
  ];

  newSeason = signal({
    name: '', startDate: '', endDate: '',
    categories: [] as string[],
    message: '', expectedGrowth: 0,
    isActive: false, bannerText: '', bannerColor: '#522B5B'
  });

  updateNewField(field: string, value: any) {
    this.newSeason.update(s => ({...s, [field]: value}));
  }

  toggleCategory(catId: string) {
    this.newSeason.update(s => ({
      ...s,
      categories: s.categories.includes(catId)
        ? s.categories.filter(c => c !== catId)
        : [...s.categories, catId]
    }));
  }

  saveSeason() {
    this.adminService.addSeason(this.newSeason());
    this.showAddModal.set(false);
    this.newSeason.set({
      name: '', startDate: '', endDate: '',
      categories: [], message: '', expectedGrowth: 0,
      isActive: false, bannerText: '', bannerColor: '#522B5B'
    });
  }

  openDetail(season: AdminSeason) {
    this.selectedSeason.set(season);
    this.showDetailModal.set(true);
  }

  toggleSeason(id: number) {
    this.adminService.toggleSeason(id);
  }

  isSeasonActive(season: AdminSeason): boolean {
    if (!season.isActive) return false;
    
    const now = new Date();
    const start = new Date(season.startDate);
    const end = new Date(season.endDate);
    
    return now >= start && now <= end;
  }

  getCategoryName(id: string): string {
    const cat = this.availableCategories.find(c => c.id === id);
    return cat ? cat.nameAr : id;
  }
}
