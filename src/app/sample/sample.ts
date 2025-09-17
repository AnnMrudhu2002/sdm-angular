import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sample',
  imports: [CommonModule],
  templateUrl: './sample.html',
  styleUrl: './sample.css'
})
export class Sample {
  isLoggedIn = true;
  
  logout() {
    this.isLoggedIn = false;
  }
}
