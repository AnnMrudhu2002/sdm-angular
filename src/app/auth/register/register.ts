import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, RegisterRequest } from '../../services/auth-service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerRequest: RegisterRequest = {
    fullName: '',
    registerNo: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  loading: boolean = false;

  constructor(
    private authService: AuthService, private toastr: ToastrService, private router: Router) { }

  allowOnlyLettersAndSpace(event: KeyboardEvent) {
    const char = event.key;
    const regex = /^[A-Za-z\s]$/;

    if (!regex.test(char)) {
      event.preventDefault(); // stop the character from being typed
    }
  }

  allowOnlyAlphanumeric(event: KeyboardEvent) {
    const charCode = event.key;
    const regex = /^[a-zA-Z0-9]*$/;

    if (!regex.test(charCode)) {
      event.preventDefault();
    }
  }

  convertToUpperCase(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.registerRequest.registerNo = input.value;
  }


  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();  // force red borders to show
      });
      this.toastr.warning("Please fill all fields correctly");
      return;
    }


    if (this.registerRequest.password !== this.registerRequest.confirmPassword) {
      this.toastr.warning("Passwords do not match");
      return;
    }

    this.loading = true;

    this.authService.register(this.registerRequest).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.toastr.success("Registration successful!");

        //Reset form
        this.registerRequest = {
          fullName: '',
          registerNo: '',
          email: '',
          password: '',
          confirmPassword: ''
        };

        // navigate to login page
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        this.loading = false;
        const msg = err?.error?.message || "Registration failed. Please try again.";
        this.toastr.error(msg);
        console.error(err);
      }
    });
  }
}
