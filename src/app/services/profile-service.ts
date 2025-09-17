import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface StudentProfileDto {
  dob: string;
  gender: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  address: string;
  permanentAddress: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  idProofTypeId: number;
  idProofNumber: string;
  courseId: number;
}

export interface StudentProfileResponse {
  message: string;
  studentId: number;
}

export interface StudentEducationDto {
  educationLevel: string; 
  instituteName: string;
  passingYear: number;
  marksPercentage: number;
}


export interface StudentEducationResponse {
  message: string;
  educationId: number;
}

export interface StudentDocumentDto {
  documentId: number;
  documentTypeName: string;
  fileName: string;
  uploadedOn: string;
  statusName: string;
  remarks?: string;
  documentTypeId: number; // important to categorize
}


export interface UploadDocumentResponse {
  message: string;
  documentId: number;
}


export interface IdProofType {
  idProofTypeId: number;
  typeName: string;
}

export interface Course {
  courseId: number;
  courseName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  submitProfile(profile: StudentProfileDto): Observable<StudentProfileResponse> {
    return this.http.post<StudentProfileResponse>(`${this.baseUrl}/StudentProfile/SubmitProfile`, profile);
  }
  
  getProfile() {
    return this.http.get<StudentProfileDto>(`${this.baseUrl}/StudentProfile/GetProfile`);
  }


  submitEducation(educationList: { educationDetails: StudentEducationDto[] }) {
    return this.http.post<StudentEducationResponse>(
      `${this.baseUrl}/StudentProfile/SubmitEducation`, educationList);
  }
  

  getEducation(): Observable<StudentEducationDto[]> {
    return this.http.get<StudentEducationDto[]>(`${this.baseUrl}/StudentProfile/GetEducation`);
  }
  uploadDocument(formData: FormData) {
    return this.http.post<UploadDocumentResponse>(`${this.baseUrl}/Document/UploadDocument`, formData);
  }

  getStudentDocuments() {
    return this.http.get<StudentDocumentDto[]>(`${this.baseUrl}/Document/GetStudentDocuments`);
  }

 

  getIdProofTypes(): Observable<IdProofType[]> {
    return this.http.get<IdProofType[]>(`${this.baseUrl}/StudentProfile/IdProofTypes`);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/StudentProfile/Courses`);
  }
  getStates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/StudentProfile/States`);
  }
  
}
