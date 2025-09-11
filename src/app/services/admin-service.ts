import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface StudentForApproval {
  studentId: number;
  fullName: string;
  registerNo: string;
}

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  
  getSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/AdminDashboard/summary`);
  }
  getPendingStudents(): Observable<StudentForApproval[]> {
    return this.http.get<StudentForApproval[]>(`${this.baseUrl}/Admin/students-for-approval`);
  }

  getStudentDocuments(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Admin/student/${studentId}/documents`);
  }

  updateDocumentStatus(documentId: number, statusId: number, remarks: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/Admin/document/${documentId}/update-status?statusId=${statusId}&remarks=${remarks}`,
      {}
    );
  }
  
  // Optional helpers
  approveDocument(documentId: number): Observable<any> {
    return this.updateDocumentStatus(documentId, 2, 'Approved');
  }
  
  rejectDocument(documentId: number, remarks: string): Observable<any> {
    return this.updateDocumentStatus(documentId, 3, remarks);
  }
  
}
