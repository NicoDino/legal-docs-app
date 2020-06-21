import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DocumentosService } from 'src/app/services/documentos.service';
import { Documento } from 'src/app/models/documento';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-crear-borrador',
  templateUrl: './crear-borrador.component.html',
  styleUrls: ['./crear-borrador.component.css'],
})
export class CrearBorradorComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  idDocumento: String;
  documento: Documento;
  showDoc = false;
  campoIndex = 0;
  constructor(private route: ActivatedRoute, private docService: DocumentosService) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      this.idDocumento = params.get('idDocumento');
      this.loadDoc(this.idDocumento);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadDoc(idDoc) {
    this.docService
      .getById(idDoc)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doc) => {
        this.documento = doc;
        this.showDoc = true;
      });
  }
}
