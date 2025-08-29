import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, LoginRequest } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginRequest: LoginRequest = {
    email: '',
    password: ''
  };

  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;

    this.authService.login(this.loginRequest).subscribe({
      next: (res: any) => {
        this.loading = false;

        // Store only token
        sessionStorage.setItem('token', res.token || '');
        // console.log(res.token);
        
        // Decode token using AuthService
        const userName = this.authService.getUserName();
        const userId = this.authService.getUserId();
        const roles = this.authService.getRoles();

        // console.log('Logged in user:', userName, roles);

        // Navigate based on role
        if (roles.includes('Admin')) {
          this.toastr.success('Logged in successfully');
          this.router.navigate(['/admin/dashboard']);
        } 
        else{
          this.toastr.success('Logged in successfully');
        }
      },
      error: (err: any) => {
        this.loading = false;
        const msg = err?.error?.message || 'Login failed. Please try again';
        this.toastr.error(msg);
      }
    });
  
  }
}
