import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  isSaved = false;
  _fb = inject(FormBuilder)
  _educationService = inject(ProfileService)
  _toastr = inject(ToastrService)
  
  constructor() {}

  ngOnInit() {
    // 10th form
    this.educationForm10 = this._fb.group({
      instituteName: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9\s\-'&.,()]+$/),
        Validators.maxLength(100)
      ]],
      passingYear: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}$/),          // 4 digits only
        Validators.min(1900),
        Validators.max(2100)
      ]],
      marksPercentage: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]]
    });

    // 12th form
    this.educationForm12 = this._fb.group({
      instituteName: ['', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z0-9\s\-'&.,()]+$/) 

      ]],
      passingYear: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}$/),
        Validators.min(1900),
        Validators.max(2100)
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
    this._educationService.getEducation().subscribe({
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

  onlyDigits(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
  
  onlyInstituteChars(event: KeyboardEvent) {
    if (!/[a-zA-Z\s\-'&.,()]/.test(event.key)) {
      event.preventDefault();
    }
  }   

  submitAllEducation() {
    if (this.educationForm10.invalid || this.educationForm12.invalid) {
      this._toastr.warning("Please fill all required fields for both 10th and 12th");
      this.educationForm10.markAllAsTouched();
      this.educationForm12.markAllAsTouched();
      return;
    }
  
    const educationDetails: StudentEducationDto[] = [
      { ...this.educationForm10.value, educationLevel: '10th' },
      { ...this.educationForm12.value, educationLevel: '12th' }
    ];
  
    this._educationService.submitEducation({ educationDetails }).subscribe({
      next: (res) => {
        this._toastr.success(res.message || 'Education details saved successfully');
        this.isSaved = true;
    
        // mark forms as pristine after save
        this.educationForm10.markAsPristine();
        this.educationForm12.markAsPristine();
      },
      error: (err) => {
        this._toastr.error(err.error.message || 'Failed to save education details');
        this.isSaved = false;
      }
    });
    
  }

  }
