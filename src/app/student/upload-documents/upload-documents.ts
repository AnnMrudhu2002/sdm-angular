import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from '../../services/document-service';
import { ProfileService, StudentDocumentDto } from '../../services/profile-service';

interface UploadedFile {
  file?: File;           // optional, only for new uploads
  fileName: string;      // for display
  documentId?: number;
  uploading: boolean;
  uploaded: boolean;
}


@Component({
  selector: 'app-upload-documents',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-documents.html',
  styleUrl: './upload-documents.css'
})
export class UploadDocuments {
  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  _fb = inject(FormBuilder)
  _profileService = inject(ProfileService)
  //_toastr = inject()

  // Dropdown options
  docTypes = [
    { id: 1, name: 'ID Proof' },
    { id: 2, name: '10th Certificate' },
    { id: 3, name: '12th Certificate' }
  ];

  uploadedDocs: StudentDocumentDto[] = [];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private documentService: DocumentService
  ) { }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      docTypeId: ['', Validators.required],
      file: [null, Validators.required],
      isAcknowledged: [false, Validators.requiredTrue]
    });

    this.loadUploadedFiles();
  }

  // Check if checkbox is ticked AND 3 documents uploaded
  canSubmitAcknowledgment(): boolean {
    return this.uploadForm.get('isAcknowledged')?.value === true && this.uploadedDocs.length >= 3;
  }

  loadUploadedFiles() {
    this.profileService.getStudentDocuments().subscribe({
      next: (docs) => {
        this.uploadedDocs = docs;
      },
      error: (err) => {
        // Only show toastr for unexpected errors, not for 404 (profile not found)
        if (err.status !== 404) {
          this.toastr.error('Failed to load documents');
        }
        // For 404, just set empty list silently
        this.uploadedDocs = [];
      }
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click(); // opens file picker
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({ file: this.selectedFile });
      this.uploadForm.get('file')?.updateValueAndValidity();

      // Auto-upload as soon as file is selected
      this.uploadFile();
    }
  }

  uploadFile() {
    if (!this.uploadForm.valid || !this.selectedFile) {
      this.toastr.warning('Please select document type and file');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('documentTypeId', this.uploadForm.value.docTypeId);

    this.profileService.uploadDocument(formData).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.uploadForm.reset();
        this.selectedFile = null;
        this.loadUploadedFiles(); // refresh list
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Upload failed');
      }
    });
  }

  downloadFile(documentId: number) {
    this.documentService.downloadDocument(documentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document'; // TODO: you can enhance with original file name
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('Failed to download file')
    });
  }

  deleteFile(documentId: number) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    this.documentService.deleteDocument(documentId).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.uploadedDocs = this.uploadedDocs.filter((d) => d.documentId !== documentId);
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to delete file')
    });
  }


  submitAcknowledgment() {
    if (!this.canSubmitAcknowledgment()) return;
  
    // this._profileService.submitAcknowledgment().subscribe({
    //   next: (res) => {
    //     this.toastr.success(res.message);
    //   },
    //   error: (err) => {
    //     this.toastr.error(err.error?.message || 'Acknowledgment failed');
    //   }
    // });
  }
}
