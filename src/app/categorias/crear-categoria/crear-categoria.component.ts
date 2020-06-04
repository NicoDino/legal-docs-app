import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CategoriasService } from 'src/app/services/categorias.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.css'],
})
export class CrearCategoriaComponent implements OnInit, OnDestroy {
  categoriaForm: FormGroup;
  disableGuardar$ = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriasService
  ) {}

  ngOnDestroy(): void {
    // TODO  DESUSCRIBIRSE ACA
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoriaForm = this.formBuilder.group({
        nombre: new FormControl(''),
        padre: new FormControl(params.get('idPadre')),
      });
    });
  }

  onSubmit() {
    this.disableGuardar$.next(true);
    this.categoriaService.create(this.categoriaForm.value).subscribe(
      (res) => {
        this.router.navigateByUrl('categorias');
      },
      (err) => {
        this.disableGuardar$.next(false);
      }
    );
  }

  onCancel() {
    this.router.navigateByUrl('categorias');
  }
}
