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

  constructor(private docService: DocumentService, private toastr: ToastrService, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.docService.getStudentDocuments().subscribe({
      next: res => {
        this.documents = res.map((doc: any) => ({
          documentId: doc.documentId,
          documentTypeId: doc.documentTypeId,  // ✅ explicitly copy
          documentTypeName: doc.documentTypeName,
          statusName: doc.statusName,
          remarks: doc.remarks,
          fileName: doc.fileName,
          showReupload: doc.statusName === 'Rejected'
        }))
      },
      error: err => console.error('Error loading documents', err)
    });
  }

  viewFile(docId: number, fileName: string) {
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
  
    console.log("Uploading for doc:", doc); // ✅ Check that documentTypeId is here
  
    const formData = new FormData();
    formData.append('file', file);
  
    if (doc.documentTypeId) {
      formData.append('documentTypeId', doc.documentTypeId.toString());
      console.log("Sent documentTypeId:", doc.documentTypeId);
    } else {
      this.toastr.error("Missing document type ID");
      return;
    }
  
    this.profileService.uploadDocument(formData).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'File uploaded successfully');
        doc.showReupload = false;
        doc.statusName = 'Pending';
        doc.remarks = null;
      },
      error: (err) => {
        const msg = err?.error?.message || 'Error uploading file';
        this.toastr.error(msg);
      }
    });
  }
  
  
  
  
}
