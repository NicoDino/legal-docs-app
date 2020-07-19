import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CategoriasService } from 'src/app/services/categorias.service';
import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.css'],
})
export class CrearCategoriaComponent implements OnInit, OnDestroy {
  categoriaForm: FormGroup;
  disableGuardar$ = new BehaviorSubject<boolean>(false);
  unsubscribe$ = new Subject<void>();
  padre: Partial<Categoria> = {};
  categoria: Partial<Categoria> = {};
  private idPadre; idCategoria; tipo;
  public loading = true;
  public viewOnly;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriasService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      this.idPadre = params.get('idPadre');
      this.idCategoria = params.get('idCat');
      this.categoriaForm = this.formBuilder.group({
        nombre: new FormControl(''),
        tipo: new FormControl(''),
        padre: new FormControl('')
      });
      if (this.idPadre) {
        this.viewOnly = true;
        this.loadPadre();
      }
      if (this.idCategoria) {
        this.loadCategoria();
      }
    });
  }

  loadPadre() {
    this.padre._id = this.idPadre;
    if (this.padre._id) {
      this.categoriaService.getById(this.padre._id).subscribe((rta: any) => {
        this.padre = rta;
        this.categoriaForm.controls.tipo.setValue(rta.tipo);
        this.categoriaForm.controls.padre.setValue(this.idPadre);
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  loadCategoria() {
    this.categoria._id = this.idCategoria;
    if (this.categoria._id) {
      this.categoriaService.getById(this.categoria._id).subscribe((rta: any) => {
        this.categoria = rta;
        this.categoriaForm.controls.nombre.setValue(rta.nombre);
        this.categoriaForm.controls.tipo.setValue(rta.tipo);
        this.categoriaForm.controls.padre.setValue(rta.padre);
        this.viewOnly = (this.padre._id || this.categoria.padre || (this.categoria.descendientes && this.categoria.descendientes.length > 0));
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  onSubmit() {
    if (this.categoriaForm.invalid) {
      alert('Debe completar todos los campos');
      return;
    }
    this.disableGuardar$.next(true);
    if (!this.categoria._id) {
      this.categoriaService.create(this.categoriaForm.value).subscribe(
        (res) => {
          this.router.navigate(['/admin/categorias']);
        }, (err) => {
          this.disableGuardar$.next(false);
        }
      );
    } else {
      const categoriaEditada = this.categoriaForm.value;
      categoriaEditada._id = this.categoria._id;
      this.categoriaService.update(categoriaEditada).subscribe(
        (res: any) => {
          this.categoria = res;
          this.disableGuardar$.next(false);
          this.router.navigate(['/admin/categorias']);
        },
        () => {
          this.disableGuardar$.next(false);
        }
      );
    }
  }

  onCancel() {
    this.router.navigateByUrl('/admin/categorias');
  }
}
