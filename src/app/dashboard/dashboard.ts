import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin-service';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  userName: string | null = '';
  pendingStudents: number = 0;
  approvedStudents: number = 0;

  constructor(private dashboardService: AdminService, private authService: AuthService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName(); 

    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.pendingStudents = data.pendingStudents;
        this.approvedStudents = data.approvedStudents;
      },
      error: (err) => {
        console.error('Error loading dashboard summary', err);
        this.toastr.error("Error loading dahsboard");
      }
    });
  }
}
