import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../services/profile-service';

interface UploadedFile {
  file?: File;           // optional, only for new uploads
  fileName: string;      // for display
  documentId?: number;   
  uploading: boolean;
  uploaded: boolean;
}


@Component({
  selector: 'app-upload-documents',
  imports: [CommonModule],
  templateUrl: './upload-documents.html',
  styleUrl: './upload-documents.css'
})
export class UploadDocuments {
 // Map of categoryId -> array of files
 selectedFiles: { [docTypeId: number]: UploadedFile[] } = {
  1: [], // ID Proof
  2: [], // 10th Certificate
  3: []  // 12th Certificate
};

submitted = false;

constructor(private uploadService: ProfileService, private toastr: ToastrService, private router: Router) { }

ngOnInit() {
  this.loadUploadedFiles();
}

loadUploadedFiles() {
  this.uploadService.getStudentDocuments().subscribe({
    next: (docs) => {
      docs.forEach(doc => {
        let docTypeId = this.getDocTypeId(doc.documentTypeName); // map name -> id
        if (!this.selectedFiles[docTypeId]) {
          this.selectedFiles[docTypeId] = [];
        }
        this.selectedFiles[docTypeId].push({
          fileName: doc.fileName,
          documentId: doc.documentId,
          uploaded: true,
          uploading: false
        });
      });
    },
    error: (err) => {
      console.error('Failed to load uploaded files', err);
    }
  });
}

// Helper function
getDocTypeId(name: string): number {
  switch(name) {
    case 'ID Proof': return 1;
    case '10th Certificate': return 2;
    case '12th Certificate': return 3;
    default: return 0;
  }
}

onFileSelected(event: Event, docTypeId: number) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      this.selectedFiles[docTypeId].push({
        file,
        fileName: file.name,
        uploading: false,
        uploaded: false
      });
    }
  }
}


uploadSingleFile(docTypeId: number, fileObj: UploadedFile, index: number) {
  if (!fileObj.file) return; // safety check

  const formData = new FormData();
  formData.append('file', fileObj.file);
  formData.append('documentTypeId', docTypeId.toString());

  fileObj.uploading = true;

  this.uploadService.uploadDocument(formData).subscribe({
    next: (res) => {
      fileObj.uploading = false;
      fileObj.uploaded = true;
      fileObj.documentId = res.documentId;
      this.toastr.success(res.message);
    },
    error: (err) => {
      fileObj.uploading = false;
      const errorMsg = err?.error?.message || "Failed to upload file";
      this.toastr.error(errorMsg);
    }
  });
}


removeFile(docTypeId: number, index: number) {
  this.selectedFiles[docTypeId].splice(index, 1);
}

submitAll() {
  this.submitted = true;
  const requiredCategories = [1, 2, 3];
  for (const cat of requiredCategories) {
    const hasUploaded = this.selectedFiles[cat].some(f => f.uploaded);
    if (!hasUploaded) {
      this.toastr.warning("Please upload at least one file for each category");
      return;
    }
  }

  this.toastr.success('All required files uploaded!');

  // Navigate after a small delay to allow the toast to show
  setTimeout(() => {
    this.router.navigate(['/student/my-documents']);
  }, 500);
}
}
