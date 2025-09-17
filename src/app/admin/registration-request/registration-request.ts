import { CommonModule } from '@angular/common';
import { TmplAstHostElement } from '@angular/compiler';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Student, StudentService } from '../../services/student-service';

@Component({
  selector: 'app-registration-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './registration-request.html',
  styleUrl: './registration-request.css'
})
export class RegistrationRequest {
  students: Student[] = [];
  pendingStudents: Student[] = []; 

  constructor(private studentService: StudentService, private cdr: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadPendingStudents();
  }

  loadPendingStudents(): void {
    this.studentService.getPendingStudents().subscribe({
      next: (res) => {
        // console.log("API Response:", res);
        //Force proper array
        this.students = res.students ? [...res.students] : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        // console.error("Error fetching students:", err);
        this.toastr.error('Failed to load pending students');

      }
    });
  }

  approveRejectStudent(userId: string, isApproved: boolean): void {
    // console.log("Approving/Rejecting userId:", userId, "isApproved:", isApproved);


    this.studentService.approveRejectStudents(userId, isApproved).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(res.message);
          this.loadPendingStudents();
        } else {
          this.toastr.warning(res.message);
        }
      },
      error: (err) => {
        this.toastr.error("Failed to update student status");
      }
    });
    
  }





  
}