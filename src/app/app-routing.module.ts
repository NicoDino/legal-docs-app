import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { CategoriasComponent } from './categorias/categorias.component';
import { CrearCategoriaComponent } from './categorias/crear-categoria/crear-categoria.component';
import { FaqsComponent } from './faqs/faqs.component';
import { CrearFaqComponent } from './faqs/crear-faq/crear-faq.component';
import { ConfiguracionUsuarioComponent } from './usuarios/configuracion-usuario/configuracion-usuario.component';
import { NgModule } from '@angular/core';
import { ReestablecerPassComponent } from './reestablecer-pass/reestablecer-pass.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { CrearDocumentoComponent } from './documentos/crear-documento/crear-documento.component';
import { BorradoresComponent } from './borradores/borradores.component';
import { InicioComponent } from './public/inicio/inicio.component';
import { PublicFaqsComponent } from './public/faqs/faqs.component';
import { CrearBorradorComponent } from './public/documentos/crear-borrador/crear-borrador.component';
import { PublicDocumentosComponent } from './public/documentos/documentos.component';
import { PreviewDocumentoComponent } from './public/documentos/vista-documento/preview-documento.component';
import { PublicBusquedaComponent } from './public/busqueda/busqueda.component';
import { FinOperacionComponent } from './public/documentos/fin-operacion/fin-operacion.component';

const appRoutes: Routes = [
  /* RUTAS PRIVADAS */
  { path: '', component: InicioComponent },
  { path: 'admin/home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'admin/categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
  { path: 'admin/crear-categoria/:idPadre', component: CrearCategoriaComponent, canActivate: [AuthGuard] },
  { path: 'admin/crear-categoria/editar/:idCat', component: CrearCategoriaComponent, canActivate: [AuthGuard] },
  { path: 'admin/crear-categoria', component: CrearCategoriaComponent, canActivate: [AuthGuard] },
  { path: 'admin/faqs', component: FaqsComponent, canActivate: [AuthGuard] },
  { path: 'admin/crear-faq/:idFaq', component: CrearFaqComponent, canActivate: [AuthGuard] },
  { path: 'admin/crear-faq', component: CrearFaqComponent, canActivate: [AuthGuard] },
  { path: 'admin/app-configuracion-usuario', component: ConfiguracionUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'admin/documentos', component: DocumentosComponent, canActivate: [AuthGuard] },
  { path: 'admin/crear-documento/:step/:idDocumento', component: CrearDocumentoComponent, canActivate: [AuthGuard] },
  { path: 'admin/crear-documento', component: CrearDocumentoComponent, canActivate: [AuthGuard] },
  { path: 'admin/borradores', component: BorradoresComponent, canActivate: [AuthGuard] },

  /*  RUTAS PUBLICAS  */
  { path: 'login', component: LoginComponent },
  { path: 'app-reestablecer-pass', component: ReestablecerPassComponent },
  { path: 'preguntas-frecuentes', component: PublicFaqsComponent },
  { path: 'nuevo-borrador/:idDocumento', component: CrearBorradorComponent },
  { path: 'documentos/:tipo', component: PublicDocumentosComponent },
  { path: 'ver-documento/:idDocumento', component: PreviewDocumentoComponent },
  { path: 'busqueda/:busqueda', component: PublicBusquedaComponent },
  { path: 'fin-operacion/:exito', component: FinOperacionComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '/' },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
