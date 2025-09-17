import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Course, District, Gender, IdProofType, Pincode, ProfileService, State, StudentProfileDto } from '../../services/profile-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  //   profileForm: FormGroup;
  //   submissionMessage: string | null = null;

  //   idProofTypes: IdProofType[] = [];
  //   courses: Course[] = [];

  //   states: State[] = [];
  //   districts: District[] = [];
  //   pincodes: Pincode[] = [];
  //   postOffices: any[] = [];

  //   constructor(private fb: FormBuilder, private profileService: ProfileService, private toastr: ToastrService) {
  //     this.profileForm = this.fb.group({
  //       dob: ['', Validators.required],
  //       gender: ['', Validators.required],
  //       phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/), Validators.maxLength(10)]],
  //       alternatePhoneNumber: ['', [Validators.pattern(/^[6-9]\d{9}$/), Validators.maxLength(10)]],
  //       address: ['', [Validators.required, Validators.maxLength(300)]],
  //       permanentAddress: ['', [Validators.required, Validators.maxLength(300)]],
  //       city: ['', [Validators.required, Validators.maxLength(100)]],
  //       district: ['', Validators.required],
  //       state: ['', Validators.required],
  //       pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  //       idProofTypeId: [0, Validators.required],
  //       idProofNumber: ['', [Validators.required, Validators.maxLength(50)]],
  //       courseId: [0, Validators.required],
  //     });
  //   }

  //   ngOnInit() {
  //     this.loadDropdowns();

  //     // Load states
  //     this.profileService.getStates().subscribe(states => this.states = states);

  //     // Watch state selection
  //    // When user selects a state
  // this.profileForm.get('state')?.valueChanges.subscribe((stateId: number) => {
  //   if (stateId) {
  //     this.profileService.getDistrictsByStateId(stateId).subscribe(districts => {
  //       this.districts = districts;
  //       this.profileForm.get('district')?.setValue('');
  //       this.pincodes = [];
  //       this.profileForm.get('pincode')?.setValue('');
  //     });
  //   } else {
  //     this.districts = [];
  //     this.pincodes = [];
  //     this.profileForm.get('district')?.setValue('');
  //     this.profileForm.get('pincode')?.setValue('');
  //   }
  // });


  //     // Watch district selection
  //     // Watch district selection
  // this.profileForm.get('district')?.valueChanges.subscribe((districtId: number) => {
  //   if (districtId) {
  //     this.profileService.getPincodesByDistrictId(districtId).subscribe(pincodes => {
  //       this.pincodes = pincodes;
  //       this.profileForm.get('pincode')?.setValue('');
  //     });
  //   } else {
  //     this.pincodes = [];
  //     this.profileForm.get('pincode')?.setValue('');
  //   }
  // });


  //     // Load profile
  //     this.profileService.getProfile().subscribe({
  //       next: profile => {
  //         if (profile) {
  //           if (profile.dob) profile.dob = profile.dob.split('T')[0];
  //           this.profileForm.patchValue(profile);
  //         }
  //       },
  //       error: err => console.error(err)
  //     });
  //   }
  //   onPincodeChange(event: any) {
  //     const pincodeId = event.target.value;

  //     if (pincodeId) {
  //       this.profileService.getPostOffices(pincodeId).subscribe({
  //         next: (data) => {
  //           this.postOffices = data;  // populate city dropdown
  //           this.profileForm.get('city')?.setValue(''); // reset city
  //         },
  //         error: (err) => {
  //           console.error("Error fetching post offices", err);
  //           this.postOffices = [];
  //           this.profileForm.get('city')?.setValue('');
  //         }
  //       });
  //     } else {
  //       this.postOffices = [];
  //       this.profileForm.get('city')?.setValue('');
  //     }
  //   }

  //   onPincodeInput() {
  //     const pincode = this.profileForm.get('pincode')?.value;

  //     if (pincode && /^\d{6}$/.test(pincode)) {
  //       // Call API only when 6 digits typed
  //       this.profileService.getPostOffices(pincode).subscribe({
  //         next: (data) => {
  //           this.postOffices = data; // populate city dropdown
  //           this.profileForm.get('city')?.setValue(''); // reset selection
  //         },
  //         error: (err) => {
  //           console.error("Error fetching post offices", err);
  //           this.postOffices = [];
  //           this.profileForm.get('city')?.setValue('');
  //         }
  //       });
  //     } else {
  //       this.postOffices = [];
  //       this.profileForm.get('city')?.setValue('');
  //     }
  //   }


  //   loadDropdowns() {
  //     this.profileService.getIdProofTypes().subscribe(res => this.idProofTypes = res);
  //     this.profileService.getCourses().subscribe(res => this.courses = res);
  //   }

  //   submitProfile() {
  //     if (this.profileForm.invalid) {
  //       this.toastr.warning("Please fill all required fields carefully");
  //       this.profileForm.markAllAsTouched();
  //       return;
  //     }

  //     const dto: StudentProfileDto = this.profileForm.value;

  //     this.profileService.submitProfile(dto).subscribe({
  //       next: res => this.toastr.success(res.message),
  //       error: err => {
  //         if (err.error?.errors) {
  //           for (const field in err.error.errors) {
  //             err.error.errors[field].forEach((msg: string) => this.toastr.error(msg));
  //           }
  //         } else if (err.error?.message) {
  //           this.toastr.error(err.error.message);
  //         } else {
  //           this.toastr.error("An unexpected error occurred");
  //         }
  //       }
  //     });
  //   }
  _fb = inject(FormBuilder)
  _profileService = inject(ProfileService)
  _toastr = inject(ToastrService)
  _router = inject(Router)
  idProofTypes: IdProofType[] = [];
  courses: Course[] = [];
  genders: Gender[] = [];
  states: State[] = [];
  districts: District[] = [];
  pincodes: Pincode[] = [];
  postOffices: any[] = [];
  isSaved = false;

  profileForm!: FormGroup;
  today = new Date().toISOString().split('T')[0]; // disable future dates

  constructor() {

  }

  ngOnInit() {
    this.loadDropdowns();

    this.profileForm = this._fb.group(
      {
        dob: ['', [Validators.required, this.pastDateValidator()]],
        genderId: [null, Validators.required],
        phoneNumber: ['', [
          Validators.required,
          Validators.pattern(/^[0-9+\s]{10,15}$/), // min 10, max 15
          Validators.minLength(10) // ensures at least 10 chars
        ]],
        alternatePhoneNumber: ['', [
          Validators.pattern(/^[0-9+\s]{10,15}$/),
          Validators.minLength(10)
        ]],
        address: ['', [Validators.required, Validators.maxLength(300)]],
        permanentAddress: ['', [Validators.required, Validators.maxLength(300)]],
        state: ['', Validators.required],
        district: ['', Validators.required],
        pincode: ['', Validators.required],
        city: ['', Validators.required],
        courseId: [null, Validators.required],
        idProofTypeId: [null, Validators.required],
        idProofNumber: ['', [Validators.required, Validators.maxLength(50)]],
      }, { validators: this.differentPhoneValidator() });
      const idControl = this.profileForm.get('idProofNumber');

      idControl?.setValidators([
        Validators.required,
        Validators.maxLength(50),
        this.idProofValidator(this.profileForm.get('idProofTypeId')?.value)
      ]);
      idControl?.updateValueAndValidity();

    // Load states
    this._profileService.getStates().subscribe(states => this.states = states);

    // Watch state selection
    this.profileForm.get('state')?.valueChanges.subscribe((stateId: number) => {
      if (stateId) {
        this._profileService.getDistrictsByStateId(stateId).subscribe(districts => {
          this.districts = districts;
          this.profileForm.get('district')?.setValue('');
          this.pincodes = [];
          this.profileForm.get('pincode')?.setValue('');
          this.postOffices = [];
          this.profileForm.get('city')?.setValue('');
        });
      } else {
        this.districts = [];
        this.pincodes = [];
        this.postOffices = [];
        this.profileForm.get('district')?.setValue('');
        this.profileForm.get('pincode')?.setValue('');
        this.profileForm.get('city')?.setValue('');
      }
    });

    // Watch district selection
    this.profileForm.get('district')?.valueChanges.subscribe((districtId: number) => {
      if (districtId) {
        this._profileService.getPincodesByDistrictId(districtId).subscribe(pincodes => {
          this.pincodes = pincodes;
          this.profileForm.get('pincode')?.setValue('');
          this.postOffices = [];
          this.profileForm.get('city')?.setValue('');
        });
      } else {
        this.pincodes = [];
        this.postOffices = [];
        this.profileForm.get('pincode')?.setValue('');
        this.profileForm.get('city')?.setValue('');
      }
    });

    // Watch ID Proof Type selection for dynamic validation
    this.profileForm.get('idProofTypeId')?.valueChanges.subscribe((typeId: number) => {
      idControl?.setValidators([
        Validators.required,
        Validators.maxLength(50),
        this.idProofValidator(typeId)
      ]);
      idControl?.updateValueAndValidity();
    });
    

    // Load profile
    this.loadProfile();
  }


  loadDropdowns() {
    this._profileService.getIdProofTypes().subscribe(res => this.idProofTypes = res);
    this._profileService.getCourses().subscribe(res => this.courses = res);
    this._profileService.getGenders().subscribe(res => this.genders = res);
  }


  loadProfile() {
    this._profileService.getProfile().subscribe({
      next: profile => {
        if (!profile) return;

        if (profile.dob) profile.dob = profile.dob.split('T')[0];

        // Step 1: Set state (convert to number)
        const stateId = Number(profile.state);
        if (stateId) {
          this.profileForm.get('state')?.setValue(stateId);

          // Step 2: Load districts
          this._profileService.getDistrictsByStateId(stateId).subscribe(districts => {
            this.districts = districts;

            // Step 3: Set district (convert to number)
            const districtId = Number(profile.district);
            if (districtId) {
              this.profileForm.get('district')?.setValue(districtId);

              // Step 4: Load pincodes
              this._profileService.getPincodesByDistrictId(districtId).subscribe(pincodes => {
                this.pincodes = pincodes;

                // Step 5: Set pincode (convert to number)
                const pincodeId = Number(profile.pincode);
                if (pincodeId) {
                  this.profileForm.get('pincode')?.setValue(pincodeId);

                  // Step 6: Load cities/postOffices
                  this._profileService.getPostOffices(pincodeId).subscribe(postOffices => {
                    this.postOffices = postOffices;

                    if (profile.city) {
                      this.profileForm.get('city')?.setValue(profile.city);
                    }
                  });
                }
              });
            }
          });
        }

        // Patch remaining fields
        this.profileForm.patchValue({
          dob: profile.dob,
          gender: profile.gender,
          phoneNumber: profile.phoneNumber,
          alternatePhoneNumber: profile.alternatePhoneNumber,
          address: profile.address,
          permanentAddress: profile.permanentAddress,
          idProofTypeId: profile.idProofTypeId,
          idProofNumber: profile.idProofNumber,
          courseId: profile.courseId
        });
      },
      error: err => console.error(err)
    });
  }

  // DOB < today
  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return new Date(control.value) >= new Date() ? { futureDate: true } : null;
    };
  }

  // phone ≠ alternatePhone
  differentPhoneValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const phone = group.get('phoneNumber')?.value;
      const alt = group.get('alternatePhoneNumber')?.value;
      const altControl = group.get('alternatePhoneNumber');

      if (phone && alt && phone === alt) {
        altControl?.setErrors({ ...altControl.errors, samePhone: true });
      } else {
        // remove samePhone error but keep others
        if (altControl?.errors) {
          const { samePhone, ...rest } = altControl.errors;
          altControl.setErrors(Object.keys(rest).length ? rest : null);
        }
      }
      return null;
    };
  }

  allowPhoneInput(event: KeyboardEvent) {
    const allowedPattern = /^[0-9+\s]$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!allowedPattern.test(inputChar)) {
      event.preventDefault(); // block invalid character
    }
  }

idProofValidator(idProofTypeId: number | null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // required handled separately
    const value = control.value.trim();

    switch (idProofTypeId) {
      case 1: // Aadhar
        return /^\d{12}$/.test(value) ? null : { invalidAadhar: true };
      case 2: // PAN
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ? null : { invalidPAN: true };
      case 3: // Driver's License
        return /^[A-Z0-9]{6,15}$/i.test(value) ? null : { invalidDL: true };
      case 4: // Voter ID
        return /^[A-Z0-9]{10}$/i.test(value) ? null : { invalidVoter: true };
      default:
        return null;
    }
  };
}




  onPincodeChange(event: any) {
    const pincodeId = event.target.value;

    if (pincodeId) {
      this._profileService.getPostOffices(pincodeId).subscribe({
        next: data => {
          this.postOffices = data;
          this.profileForm.get('city')?.setValue('');
        },
        error: err => {
          console.error('Error fetching post offices', err);
          this.postOffices = [];
          this.profileForm.get('city')?.setValue('');
        }
      });
    } else {
      this.postOffices = [];
      this.profileForm.get('city')?.setValue('');
    }
  }

  onPincodeInput() {
    const pincode = this.profileForm.get('pincode')?.value;

    if (pincode && /^\d{6}$/.test(pincode)) {
      this._profileService.getPostOffices(pincode).subscribe({
        next: data => {
          this.postOffices = data;
          this.profileForm.get('city')?.setValue('');
        },
        error: err => {
          console.error('Error fetching post offices', err);
          this.postOffices = [];
          this.profileForm.get('city')?.setValue('');
        }
      });
    } else {
      this.postOffices = [];
      this.profileForm.get('city')?.setValue('');
    }
  }



  // getLabel(field: string): string {
  //   const labels: { [key: string]: string } = {
  //     dob: 'Date of Birth',
  //     gender: 'Gender',
  //     phoneNumber: 'Phone Number',
  //     alternatePhoneNumber: 'Alternate Phone Number',
  //     address: 'Current Address',
  //     permanentAddress: 'Permanent Address',
  //     city: 'City',
  //     district: 'District',
  //     state: 'State',
  //     pincode: 'Pincode',
  //     idProofTypeId: 'ID Proof Type',
  //     idProofNumber: 'ID Proof Number',
  //     courseId: 'Course'
  //   };
  //   return labels[field] || field;
  // }

  // submitProfile() {
  //   if (this.profileForm.invalid) {
  //     this.profileForm.markAllAsTouched();

  //     // Show specific toastr messages
  //     for (const field in this.profileForm.controls) {
  //       const control = this.profileForm.get(field);
  //       if (control && control.invalid) {
  //         if (control.errors?.['required']) {
  //           this._toastr.warning(`${this.getLabel(field)} is required`);
  //         } else if (control.errors?.['pattern']) {
  //           this._toastr.warning(`${this.getLabel(field)} has invalid format`);
  //         } else if (control.errors?.['maxlength']) {
  //           this._toastr.warning(`${this.getLabel(field)} exceeds maximum length`);
  //         }
  //       }
  //     }
  //     return;
  //   }

  //   const dto: StudentProfileDto = this.profileForm.value;
  //   this._profileService.submitProfile(dto).subscribe({
  //     next: res => this._toastr.success(res.message),
  //     error: err => {
  //       if (err.error?.errors) {
  //         for (const field in err.error.errors) {
  //           err.error.errors[field].forEach((msg: string) => this._toastr.error(msg));
  //         }
  //       } else if (err.error?.message) {
  //         this._toastr.error(err.error.message);
  //       } else {
  //         this._toastr.error('An unexpected error occurred');
  //       }
  //     }
  //   });
  // }

  // submitProfile() {
  //   this.profileForm.markAllAsTouched();
  //   if (this.profileForm.invalid) {
  //     this.profileForm.markAllAsTouched();
  //     this._toastr.warning("Please fill all required fields carefully");
  //     return;
  //   }

  //   this._profileService.submitProfile(this.profileForm.value).subscribe({
  //     next: res => this._toastr.success(res.message),
  //     error: err => this._toastr.error(err.error?.message || 'An unexpected error occurred')
  //   });
  // }

  submitProfile() {
    this.profileForm.markAllAsTouched();
  
    if (this.profileForm.invalid) {
      this._toastr.warning("Please fill all required fields carefully");
      return;
    }
  
    this._profileService.submitProfile(this.profileForm.value).subscribe({
      next: res => {
        this._toastr.success(res.message);
        this.profileForm.markAsPristine(); // reset dirty state
        this.isSaved = true; // mark as saved
      },
      error: err => {
        this._toastr.error(err.error?.message || 'An unexpected error occurred');
        this.isSaved = false;
      }
    });
  }
  
  canSave(): boolean {
    return this.profileForm.valid && this.profileForm.dirty;
  }
  
  canNext(): boolean {
    return this.profileForm.valid && (!this.profileForm.dirty || this.isSaved);
  }
  
  goNext() {
    this._router.navigate
  }
}
