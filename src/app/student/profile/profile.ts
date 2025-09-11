import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { Course, IdProofType, ProfileService, StudentProfileDto } from '../../services/profile-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  profileForm: FormGroup;
  submissionMessage: string | null = null;
  selectedFile: File | null = null;

  idProofTypes: IdProofType[] = [];
  courses: Course[] = [];

  constructor(private fb: FormBuilder, private profileService: ProfileService, private toastr: ToastrService) {
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
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/), Validators.maxLength(6)]],
      idProofTypeId: [0, Validators.required],
      idProofNumber: ['', [Validators.required, Validators.maxLength(50)]],
      courseId: [0, Validators.required],
    });
    
  }

  ngOnInit() {
    this.loadDropdowns();
  
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        if (profile) {
          console.log("Loaded profile:", profile);
          if (profile.dob) {
            profile.dob = profile.dob.split('T')[0];
          }
          this.profileForm.patchValue(profile);
        }
      },
      error: (err) => {
        console.error("Error loading profile:", err);
       
      }
    });
  }

  
  loadDropdowns() {
    this.profileService.getIdProofTypes().subscribe((res: IdProofType[]) => this.idProofTypes = res);
    this.profileService.getCourses().subscribe((res: Course[])  => this.courses = res);
  }


  submitProfile() {
    if (this.profileForm.invalid) {
      this.toastr.warning("Please fill all required fields carefully");
      this.profileForm.markAllAsTouched();
      return;
    }

    const dto: StudentProfileDto = this.profileForm.value;
    console.log("Submitting profile DTO:", dto);

    this.profileService.submitProfile(dto)
      .subscribe({
        next: (res) => {
          console.log("Response from API:", res);
          this.toastr.success(res.message);
        },
        error: (err) => {
          console.error("Error from API:", err);
          this.toastr.error(err.error.message);
        }
      });
  }
  
}
