import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environment';
import jwtDecodePkg from 'jwt-decode';

const jwtDecode: <T>(token: string) => T = (jwtDecodePkg as any).default || jwtDecodePkg;


export interface RegisterRequest {
  
  fullName: string;
  registerNo: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId?: string;
  message?: string;
}

export interface JwtPayload {
  name: string;           
  nameid: string;          
  role: string[];            
  jti: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private route: Router) {}

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/Authentication/Register`, request);
  }
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Authentication/login`, request);
  }

  logout(): void {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.clear();
    this.route.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      return jwtDecode(token); 
    } catch (err) {
      console.error('Invalid JWT token', err);
      return null;
    }
  }
  

  getUserName(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
  }
  
  getUserId(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
  }
  
  getRoles(): string[] {
    const decoded = this.getDecodedToken();
    const role = decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role ? [role] : [];
  }
  

  isLoggedIn(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;
    // check expiration
    return decoded.exp * 1000 > Date.now();
  }

}
