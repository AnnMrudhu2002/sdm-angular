import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile-service';

@Component({
  selector: 'app-view-profile',
  imports: [CommonModule,RouterModule],
  templateUrl: './view-profile.html',
  styleUrl: './view-profile.css'
})
export class ViewProfile {
  student: any;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res) => this.student = res,
      error: (err) => console.error(err)
    });
  }
}
