import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { Course, IdProofType, ProfileService, StudentProfileDto } from '../../services/profile-service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  profileForm!: FormGroup;
  states: string[] = [];
  idProofTypes: IdProofType[] = [];
  courses: Course[] = [];
  submissionMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
    this.loadStates();
    this.loadProfile();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/), Validators.maxLength(10)]],
      alternatePhoneNumber: ['', [Validators.pattern(/^[6-9]\d{9}$/), Validators.maxLength(10)]],
      address: ['', [Validators.required, Validators.maxLength(300)]],
      permanentAddress: ['', [Validators.required, Validators.maxLength(300)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      district: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(100)]],
      pincode: ['', [
        Validators.required,
        Validators.pattern(/^[1-9][0-9]{5}$/) // 6 digits, cannot start with 0
      ]],
      idProofTypeId: [0, Validators.required],
      idProofNumber: ['', [Validators.required, this.validateIdProof.bind(this)]],

      courseId: [0, Validators.required],
    });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) { // only digits 0-9
      event.preventDefault();
    }
  }
  validateIdProof(control: AbstractControl): ValidationErrors | null {
    const idTypeId = this.profileForm?.get('idProofTypeId')?.value;
    const value = control.value?.trim();
    if (!value) return null;
  
    switch (idTypeId) {
      case 1: // Aadhar
        return /^\d{12}$/.test(value) ? null : { invalidIdProof: 'Aadhar must be 12 digits' };
      case 2: // PAN
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase()) ? null : { invalidIdProof: 'PAN format invalid' };
      case 3: // Driver's License
        return /^[A-Z0-9]{8,15}$/i.test(value) ? null : { invalidIdProof: 'Driver License invalid (8-15 chars)' };
      case 4: // Voters ID
        return /^[A-Z0-9]{10}$/i.test(value) ? null : { invalidIdProof: 'Voters ID must be 10 chars' };
      default:
        return null;
    }
  }
    
  private loadDropdowns() {
    // ID Proof Types
    this.profileService.getIdProofTypes().subscribe({
      next: (res: IdProofType[]) => this.idProofTypes = res,
      error: (err) => console.error("Error loading ID Proof Types", err)
    });

    // Courses
    this.profileService.getCourses().subscribe({
      next: (res: Course[]) => this.courses = res,
      error: (err) => console.error("Error loading courses", err)
    });
  }

  private loadStates() {
    this.profileService.getStates().subscribe({
      next: (res: string[]) => this.states = res,
      error: (err) => console.error("Error loading states", err)
    });
  }

  private loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        if (profile) {
          if (profile.dob) {
            profile.dob = profile.dob.split('T')[0]; // for input type=date
          }
          this.profileForm.patchValue(profile);
        }
      },
      error: (err) => console.error("Error loading profile", err)
    });
  }

  submitProfile() {
    if (this.profileForm.invalid) {
      this.toastr.warning("Please fill all required fields carefully");
      this.profileForm.markAllAsTouched();
      return;
    }

    const dto: StudentProfileDto = this.profileForm.value;
    console.log("Submitting profile DTO:", dto);

    this.profileService.submitProfile(dto).subscribe({
      next: (res) => {
        console.log("Response from API:", res);
        this.toastr.success(res.message || "Profile submitted successfully");
      },
      error: (err) => {
        console.error("Error from API:", err);
        this.toastr.error(err?.error?.message || "Failed to submit profile");
      }
    });
  }
}
