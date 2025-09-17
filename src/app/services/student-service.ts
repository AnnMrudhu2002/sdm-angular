import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface Student {
  id: string;
  fullName: string;
  email: string;
  registerNo: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class StudentService {

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getPendingStudents(): Observable<{ message: string, students: Student[] }> {
    return this.http.get<{ message: string, students: Student[] }>(`${this.baseUrl}/Student/GetPendingStudents`);
  }




  // approveRejectStudents(userId: string, isApproved: boolean): Observable<{ message: string }> {
  //   return this.http.patch<{ message: string }>(`${this.baseUrl}/Student/ApproveRejectStudents`, { userId, isApproved });   
  // }

 
  
  approveRejectStudents(userId: string, isApproved: boolean) {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/Student/ApproveRejectStudents`, { userId, isApproved });
  }
  
}
