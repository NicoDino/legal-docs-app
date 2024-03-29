import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configuracion-usuario',
  templateUrl: './configuracion-usuario.component.html',
})
export class ConfiguracionUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  cambiarPassForm: FormGroup;
  confirmaNuevaPassControl: FormControl;
  activarEdicion$ = new BehaviorSubject<boolean>(false);
  cambiarPass$ = new BehaviorSubject<boolean>(false);
  usuarioOriginal: User;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.crearForms();
    this.usuarioOriginal = this.authService.currentUserValue;
    this.setValues(this.usuarioOriginal);
  }

  private crearForms() {
    this.usuarioForm = this.fb.group({
      nombre: [''],
      apellido: [''],
      email: [''],
    });
    this.usuarioForm.controls.nombre.disable();
    this.usuarioForm.controls.apellido.disable();
    this.usuarioForm.controls.email.disable();

    this.cambiarPassForm = this.fb.group({
      passActual: [''],
      nuevaPass: [''],
      confirmaNuevaPass: [''],
    });
  }

  private setValues(usuario) {
    this.usuarioForm.controls.nombre.setValue(usuario.nombre);
    this.usuarioForm.controls.apellido.setValue(usuario.apellido);
    this.usuarioForm.controls.email.setValue(usuario.email);
  }

  toggleEdicion() {
    const enableEdition = !this.activarEdicion$.getValue();
    this.activarEdicion$.next(enableEdition);
    if (enableEdition) {
      this.usuarioForm.controls.nombre.enable();
      this.usuarioForm.controls.apellido.enable();
      this.usuarioForm.controls.email.enable();
    } else {
      this.setValues(this.usuarioOriginal);
      this.usuarioForm.controls.nombre.disable();
      this.usuarioForm.controls.apellido.disable();
      this.usuarioForm.controls.email.disable();
    }
  }

  toggleCambiarPass() {
    const nextValue = !this.cambiarPass$.getValue();
    this.cambiarPass$.next(nextValue);
    if (!nextValue) {
      this.cambiarPassForm.reset();
    }
  }

  onSubmitDatos() {
    const usuarioActualizado = this.usuarioForm.value;
    usuarioActualizado.id = this.usuarioOriginal.id;
    this.toggleEdicion();
    this.userService.update(usuarioActualizado).subscribe((res) => {
      this.authService.updateUser(res);
      this.setValues(res);
    });
  }
  onSubmitPass() {
    if (!(this.cambiarPassForm.controls.nuevaPass.value === this.cambiarPassForm.controls.confirmaNuevaPass.value)) {
    }
    this.userService.changePass(this.usuarioOriginal.id, this.cambiarPassForm.value).subscribe(res => {
      this.toastr.success('¡Éxito!', 'La contraseña ha sido actualizada');
      this.toggleCambiarPass();
    });
  }
  onCancel() {
    this.router.navigate(['/']);
  }
}
