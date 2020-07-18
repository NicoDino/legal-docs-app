import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import { HomeComponent } from '../home/home.component';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./../public/public.css', './login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    public email = '';
    public password = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.isLoggedIn) {
            this.router.navigate(['/admin/home']);
        }
    }

    ngOnInit() {
    }

    async onSubmit() {
        this.submitted = true;
        this.loading = true;
        try {
            this.authenticationService.login(this.email, this.password);
        } catch (error) {
            this.alertService.error(error);
            this.loading = false;
        }
    }
}
