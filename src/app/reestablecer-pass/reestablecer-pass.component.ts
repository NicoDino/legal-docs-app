import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reestablecer-pass',
  templateUrl: './reestablecer-pass.component.html',
  styleUrls: ['./reestablecer-pass.component.css'],
})
export class ReestablecerPassComponent implements OnInit {
  resetView = false;
  emailForm: FormGroup;
  codigoForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: [''],
    });
    this.codigoForm = this.fb.group({
      email: [''],
      codigo: [''],
      nuevaPass: [''],
      confirmaNuevaPass: [''],
    });
  }

  onSubmit() {
    const email = this.emailForm.controls.email.value;
    this.userService.requestToken(email).subscribe((res) => {
      this.alertService.success('Código enviado');
    });
  }
  onCodeSubmit() {
    this.userService.resetPass(this.codigoForm.value).subscribe((res) => {
      this.alertService.success('Contraseña actualizada');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    });
  }

  toggleView() {
    this.resetView = !this.resetView;
  }
}
