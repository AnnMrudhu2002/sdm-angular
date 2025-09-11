import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(private authService: AuthService) {}

  isAdmin(): boolean {
    return this.authService.getRoles().includes('Admin');
  }

  isStudent(): boolean {
    return this.authService.getRoles().includes('Student');
  }
}
