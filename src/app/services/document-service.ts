import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface StudentDocumentDto {
  documentId: number;
  documentTypeName: string;
  fileName: string;
  uploadedOn: string;
  statusName: string;
  remarks?: string;
  documentTypeId: number; // important to categorize
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getStudentDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Document/my-documents`);
  }
  

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/Document/download/${documentId}`, { responseType: 'blob' });
  }
  
  viewDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/Document/${documentId}/view`, { responseType: 'blob' });
  }
  

  reuploadDocument(documentId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);  
    return this.http.post(`${this.baseUrl}/Document/reupload/${documentId}`, formData);
  }
  
  deleteDocument(documentId: number) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/Document/${documentId}`);
  }
  
  
}
