import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-apply',
  imports: [ReactiveFormsModule],
  templateUrl: './merchant-apply.component.html',
  styleUrl: './merchant-apply.component.scss'
})
export class MerchantApplyComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  currentStep = signal<number>(1);
  showOtp = signal<boolean>(false);
  showSuccess = signal<boolean>(false);

  wizardForm = this.fb.group({
    businessInfo: this.fb.group({
      businessName: ['', [Validators.required]],
      description: ['', [Validators.required]]
    }),
    categories: this.fb.group({
      beauty: [false],
      food: [false],
      crafts: [false],
      fashion: [false]
    }),
    social: this.fb.group({
      instagram: [''],
      facebook: [''],
      tiktok: [''],
      snapchat: ['']
    }),
    contact: this.fb.group({
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    }),
    terms: this.fb.group({
      agreed: [false, [Validators.requiredTrue]]
    }),
    otp: ['']
  });

  nextStep() {
    const currentGroup = this.getStepGroup(this.currentStep());
    if (currentGroup && currentGroup.invalid) {
      currentGroup.markAllAsTouched();
      return;
    }

    if (this.currentStep() === 2) {
      const cats = this.wizardForm.get('categories')?.value;
      if (!cats?.beauty && !cats?.food && !cats?.crafts && !cats?.fashion) {
        alert('يجب اختيار تصنيف واحد على الأقل');
        return;
      }
    }

    if (this.currentStep() < 5) {
      this.currentStep.update(s => s + 1);
    } else {
      this.submitApplication();
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  submitApplication() {
    if (this.wizardForm.get('terms')?.invalid) {
      this.wizardForm.get('terms')?.markAllAsTouched();
      return;
    }
    this.showOtp.set(true);
  }

  verifyOtp() {
    const otp = this.wizardForm.get('otp')?.value;
    if (otp && otp.length === 6) {
      this.showOtp.set(false);
      this.showSuccess.set(true);
    } else {
      alert('رمز التحقق يجب أن يكون 6 أرقام');
    }
  }

  private getStepGroup(step: number) {
    switch (step) {
      case 1: return this.wizardForm.get('businessInfo');
      case 2: return this.wizardForm.get('categories');
      case 3: return this.wizardForm.get('social');
      case 4: return this.wizardForm.get('contact');
      case 5: return this.wizardForm.get('terms');
      default: return null;
    }
  }
}
