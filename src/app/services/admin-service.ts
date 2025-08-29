import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  
  getSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/AdminDashboard/summary`);
  }
}
