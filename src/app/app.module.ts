import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { CategoriasComponent } from './categorias/categorias.component';
import { ArbolItemComponent } from './categorias/arbol-item/arbol-item.component';
import { CrearCategoriaComponent } from './categorias/crear-categoria/crear-categoria.component';
import { MenuComponent } from './components/menu/menu.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FaqsComponent } from './faqs/faqs.component';
import { CrearFaqComponent } from './faqs/crear-faq/crear-faq.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ConfiguracionUsuarioComponent } from './usuarios/configuracion-usuario/configuracion-usuario.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ReestablecerPassComponent } from './reestablecer-pass/reestablecer-pass.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { CrearDocumentoComponent } from './documentos/crear-documento/crear-documento.component';
import { CampoItemComponent } from './documentos/campos/campo-item/campo-item.component';

import { BorradoresComponent } from './borradores/borradores.component';

import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { InicioComponent } from './public/inicio/inicio.component';
import { PublicMenuComponent } from './public/partials/menu/menu.component';
import { FooterComponent } from './public/partials/footer/footer.component';
import { PublicFaqsComponent } from './public/faqs/faqs.component';
import { CrearBorradorComponent } from './public/documentos/crear-borrador/crear-borrador.component';
import { PublicDocumentosComponent } from './public/documentos/documentos.component';
import { PreviewDocumentoComponent } from './public/documentos/vista-documento/preview-documento.component';
import { PublicBusquedaComponent } from './public/busqueda/busqueda.component';
import { LoaderComponent } from './public/partials/loader/loader.component';
import { FinOperacionComponent } from './public/documentos/fin-operacion/fin-operacion.component';
import { PublicItemArbolComponent } from './public/documentos/public-items-arbol/public-item-arbol.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CrearSubdocumentoComponent } from './documentos/campos/crear-subdocumento/crear-subdocumento.component';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CrearCampoComponent } from './documentos/campos/crear-campo/crear-campo.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    EditorModule,
    AppRoutingModule,
    MDBBootstrapModulesPro,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    MenuComponent,
    HomeComponent,
    LoginComponent,
    CategoriasComponent,
    FaqsComponent,
    ArbolItemComponent,
    CrearCategoriaComponent,
    CrearFaqComponent,
    ConfiguracionUsuarioComponent,
    ReestablecerPassComponent,
    DocumentosComponent,
    CrearDocumentoComponent,
    CrearSubdocumentoComponent,
    CampoItemComponent,
    BorradoresComponent,
    InicioComponent,
    PublicMenuComponent,
    FooterComponent,
    PublicFaqsComponent,
    CrearDocumentoComponent,
    PublicDocumentosComponent,
    PreviewDocumentoComponent,
    PublicBusquedaComponent,
    CrearBorradorComponent,
    LoaderComponent,
    FinOperacionComponent,
    PublicItemArbolComponent,
    CrearCampoComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    BsModalRef
  ],
  entryComponents: [
    CrearCampoComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
