import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileService, StudentEducationDto } from '../../services/profile-service';

@Component({
  selector: 'app-educational-details',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './educational-details.html',
  styleUrl: './educational-details.css'
})
export class EducationalDetails {
  educationForm10!: FormGroup;
  educationForm12!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private educationService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // 10th form
    this.educationForm10 = this.fb.group({
      instituteName: ['', Validators.required],
      passingYear: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear())
      ]],
      marksPercentage: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]]
    });

    // 12th form
    this.educationForm12 = this.fb.group({
      instituteName: ['', Validators.required],
      passingYear: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear())
      ]],
      marksPercentage: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]]
    });

    this.loadEducation();
  }

  // load saved education
  loadEducation() {
    this.educationService.getEducation().subscribe({
      next: (res: StudentEducationDto[]) => {
        res.forEach(e => {
          if (e.educationLevel === '10th') {
            this.educationForm10.patchValue(e);
          } else if (e.educationLevel === '12th') {
            this.educationForm12.patchValue(e);
          }
        });
      },
      error: (err) => {
        console.error('Error loading education:', err);
      }
    });
  }

  // submit education for a specific level
  submitAllEducation() {
    if (this.educationForm10.invalid || this.educationForm12.invalid) {
      this.toastr.warning("Please fill all required fields for both 10th and 12th");
      this.educationForm10.markAllAsTouched();
      this.educationForm12.markAllAsTouched();
      return;
    }
  
    const educationDetails: StudentEducationDto[] = [
      { ...this.educationForm10.value, educationLevel: '10th' },
      { ...this.educationForm12.value, educationLevel: '12th' }
    ];
  
    this.educationService.submitEducation({ educationDetails }).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Education details saved successfully');
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Failed to save education details');
      }
    });
  }
}
