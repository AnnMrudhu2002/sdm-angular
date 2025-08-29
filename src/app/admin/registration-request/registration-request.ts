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
        console.log("API Response:", res);
        //Force proper array
        this.students = res.students ? [...res.students] : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching students:", err);
        this.toastr.error('Failed to load pending students');

      }
    });
  }

  approveRejectStudent(userId: string, isApproved: boolean): void {
    console.log("Approving/Rejecting userId:", userId, "isApproved:", isApproved);


    this.studentService.approveRejectStudents(userId, isApproved).subscribe({
      next: (res) => {
        this.loadPendingStudents();
        // this.cdr.detectChanges();
        this.pendingStudents = this.pendingStudents.filter(s => s.id !== userId);
        this.toastr.success('Successfully updated student status');

      },
      // error: (err) => {
      //   // console.error("Error updating student status:", err);
      //   // this.toastr.error('Failed to update student status');
      //   const msg = err?.error?.message 
      //   this.toastr.error(msg);
      // }
      error: (err) => {
        console.error("Error updating student status:", err);
      
        let msg = "Failed to update student status";
      
        if (typeof err?.error === 'string') {
          msg = err.error;  // if backend sends plain string
          this.toastr.error(msg);
        } else if (err?.error?.message) {
          msg = err.error.message;  // if backend sends { message: "..." }
          this.toastr.success(msg);

        }
      
      }
      
    });
  }

}