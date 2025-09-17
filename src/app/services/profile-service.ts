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


export interface State {
  stateId: number;
  stateName: string;
}

export interface District {
  districtId: number;
  districtName: string;
  stateId: number;
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
export interface Course {
  courseId: number;
  courseName: string;
}

export interface Gender {
  genderId: number;
  name: string;
}

export interface State {
  stateId: number;
  stateName: string;
}

export interface District {
  districtId: number;
  districtName: string;
  stateId: number;
}

export interface Pincode {
  pincodeId: number;
  code: string;
  districtId: number;
}

export interface PostOffice {
  officeId: number;
  officeName: string;
  pincodeId: number;
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

  getGenders(): Observable<Gender[]> {
    return this.http.get<Gender[]>(`${this.baseUrl}/StudentProfile/Genders`);
  }
 

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.baseUrl}/StudentProfile/getAllState`);
  }
  getDistrictsByStateId(stateId: number): Observable<District[]> {
    return this.http.get<District[]>(`${this.baseUrl}/StudentProfile/${stateId}`);
  }
  getPincodesByDistrictId(districtId: number): Observable<Pincode[]> {
    return this.http.get<Pincode[]>(`${this.baseUrl}/StudentProfile/pincodes/${districtId}`);
  }
  
getPostOffices(pincodeId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/StudentProfile/postoffices/${pincodeId}`);
}

 
}
