import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(private authService: AuthService, private router: Router) {}

  
  onLogout() {
    this.authService.logout(); // This clears sessionStorage and navigates to login
  }
}
