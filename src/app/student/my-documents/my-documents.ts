// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DocumentService } from '../../services/document-service';

// @Component({
//   selector: 'app-my-documents',
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './my-documents.html',
//   styleUrls: ['./my-documents.css']
// })
// export class MyDocuments {
//   documents: any[] = [];

//   constructor(private docService: DocumentService) {}

//   ngOnInit(): void {
//     this.loadDocuments();
//   }

//   loadDocuments() {
//     this.docService.getStudentDocuments().subscribe({
//       next: res => {
//         console.log('Documents:', res);
//         this.documents = res;
//       },
//       error: err => console.error('Error loading documents', err)
//     });
//   }

//   viewFile(docId: number, fileName: string) {
//     this.docService.downloadDocument(docId).subscribe(blob => {
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileName;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     });
//   }

//   onReupload(event: any, docId: number) {
//     const file = event.target.files[0];
//     if (file) {
//       this.docService.reuploadDocument(docId, file).subscribe({
//         next: () => {
//           alert('File re-uploaded successfully');
//           this.loadDocuments();
//         },
//         error: err => console.error('Error re-uploading file', err)
//       });
//     }
//   }

//   // Helper for template: returns true if there is at least one rejected document
//   hasRejectedDocs(): boolean {
//     return this.documents.some(doc => doc.statusName === 'Rejected');
//   }
// }


import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document-service';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../services/profile-service';

@Component({
  selector: 'app-my-documents',
  standalone: true,       // <-- make sure this is standalone
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './my-documents.html',
  styleUrls: ['./my-documents.css']
})
export class MyDocuments {
  documents: any[] = [];
  pendingDocs: any[] = [];
  approvedDocs: any[] = [];
  rejectedDocs: any[] = [];

  constructor(private docService: DocumentService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.docService.getStudentDocuments().subscribe({
      next: res => {
        this.documents = res;

        // Split documents by status
        this.pendingDocs = this.documents.filter(d => d.statusName === 'Pending');
        this.approvedDocs = this.documents.filter(d => d.statusName === 'Approved');
        this.rejectedDocs = this.documents.filter(d => d.statusName === 'Rejected');
      },
      error: err => console.error('Error loading documents', err)
    });
  }

  downloadFile(docId: number, fileName: string) {
    this.docService.downloadDocument(docId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  

  onReupload(event: any, doc: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.docService.reuploadDocument(doc.documentId, file).subscribe({
      next: () => {
        this.toastr.success('File re-uploaded successfully');

        // Move doc from rejected → pending
        this.rejectedDocs = this.rejectedDocs.filter(d => d.documentId !== doc.documentId);
        doc.statusName = 'Pending';
        doc.remarks = null;
        this.pendingDocs.push(doc);
      },
      error: err => {
        this.toastr.error(err.error || 'Error re-uploading file');
      }
    });
  }
}