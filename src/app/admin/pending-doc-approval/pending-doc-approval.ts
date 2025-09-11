// import { Component } from '@angular/core';
// import { CommonModule, NgFor, NgIf } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdminService, StudentForApproval } from '../../services/admin-service';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
// import { AdminService, StudentForApproval } from "../../services/admin-service";

// @Component({
//   selector: 'app-pending-doc-approval',
//   standalone: true,
//   imports: [CommonModule, NgFor, NgIf, FormsModule],
//   templateUrl: './pending-doc-approval.html',
//   styleUrls: ['./pending-doc-approval.css']
// })
// export class PendingDocApproval {
//   students: StudentForApproval[] = [];
//   selectedStudentDocs: any[] = [];
//   showDocsModal = false;
//   selectedFileUrl: SafeResourceUrl | null = null;

//   constructor(private adminService: AdminService, private sanitizer: DomSanitizer) {}

//   ngOnInit(): void {
//     this.loadPendingStudents();
//   }

//   loadPendingStudents() {
//     this.adminService.getPendingStudents().subscribe(res => this.students = res);
//   }

//   viewProfile(studentId: number) {
//     // Implement modal or navigation to view student profile
//     alert('View profile: ' + studentId);
//   }

//   viewDocuments(studentId: number) {
//     this.adminService.getStudentDocuments(studentId).subscribe(res => {
//       this.selectedStudentDocs = res;
//       this.showDocsModal = true;
//     });
//   }

//   viewFile(fileUrl: string) {
//     this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
//   }

//   approve(docId: number) {
//     this.adminService.approveDocument(docId).subscribe(() => {
//       alert('Document approved');
//       this.loadPendingStudents(); // reload
//       this.selectedStudentDocs = this.selectedStudentDocs.filter(d => d.documentId !== docId);
//     });
//   }

//   reject(docId: number, remarks: string) {
//     this.adminService.rejectDocument(docId, remarks).subscribe(() => {
//       alert('Document rejected');
//       this.loadPendingStudents();
//       this.selectedStudentDocs = this.selectedStudentDocs.filter(d => d.documentId !== docId);
//     });
//   }

//   closeDocsModal() {
//     this.showDocsModal = false;
//     this.selectedStudentDocs = [];
//     this.selectedFileUrl = null;
//   }
// }

import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, StudentForApproval } from '../../services/admin-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pending-doc-approval',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './pending-doc-approval.html',
  styleUrls: ['./pending-doc-approval.css']
})
export class PendingDocApproval {
  students: StudentForApproval[] = [];
  selectedStudentDocs: any[] = [];
  showDocsModal = false;
  selectedFileUrl: SafeResourceUrl | null = null;

  activeRejectId: number | null = null;
  rejectRemarks: string = '';

  constructor(private adminService: AdminService, private sanitizer: DomSanitizer, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadPendingStudents();
  }

  loadPendingStudents() {
    this.adminService.getPendingStudents().subscribe(res => this.students = res);
  }

  viewProfile(studentId: number) {
    alert('View profile: ' + studentId);
  }

  viewDocuments(studentId: number) {
    this.adminService.getStudentDocuments(studentId).subscribe(res => {
      this.selectedStudentDocs = res;
      this.showDocsModal = true;
    });
  }

  viewFile(fileUrl: string) {
    this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  approve(docId: number) {
    this.adminService.updateDocumentStatus(docId, 2, 'Approved').subscribe(() => {
      this.toastr.success('Document approved successfully');
      this.loadPendingStudents();
      this.selectedStudentDocs = this.selectedStudentDocs.filter(d => d.documentId !== docId);
    });
  }
  

  toggleReject(docId: number) {
    this.activeRejectId = this.activeRejectId === docId ? null : docId;
    this.rejectRemarks = '';
  }
  confirmReject(docId: number) {
    if (!this.rejectRemarks.trim()) {
      this.toastr.warning("Please enter remarks before rejecting.", "Remarks Required");
      return;
    }
  
    this.adminService.updateDocumentStatus(docId, 3, this.rejectRemarks).subscribe(() => {
      this.toastr.success('Document rejected');
      this.loadPendingStudents();
      this.selectedStudentDocs = this.selectedStudentDocs.filter(d => d.documentId !== docId);
      this.activeRejectId = null;
      this.rejectRemarks = '';
    });
  }

  cancelReject() {
    this.activeRejectId = null;
    this.rejectRemarks = '';
  }

  closeDocsModal() {
    this.showDocsModal = false;
    this.selectedStudentDocs = [];
    this.selectedFileUrl = null;
    this.activeRejectId = null;
    this.rejectRemarks = '';
  }
}
