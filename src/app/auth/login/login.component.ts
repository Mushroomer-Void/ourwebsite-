import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthMockService } from '../../core/api/mock/auth.mock.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthMockService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  error = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    const success = this.authService.login(email!, password!);

    if (success) {
      const role = this.authService.role();
      if (role === 'admin') this.router.navigate(['/admin']);
      else if (role === 'merchant') this.router.navigate(['/merchant']);
      else this.router.navigate(['/']);
    } else {
      this.error = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
  }
}
