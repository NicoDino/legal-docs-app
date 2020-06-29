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
import { CrearCampoComponent } from './documentos/campos/crear-campo/crear-campo.component';
import { CrearDocumentoComponent } from './documentos/crear-documento/crear-documento.component';
import { BorradoresComponent } from './borradores/borradores.component';
import { InicioComponent } from './public/inicio/inicio.component';
import { PublicFaqsComponent } from './public/faqs/faqs.component';
import { CrearBorradorComponent } from './borradores/crear-borrador/crear-borrador.component';
import { PublicDocumentosComponent } from './public/documentos/documentos.component';
import { PreviewDocumentoComponent } from './public/documentos/vista-documento/preview-documento.component';

const appRoutes: Routes = [
  /* RUTAS PRIVADAS */
  { path: '', component: InicioComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
  { path: 'crear-categoria/:idPadre', component: CrearCategoriaComponent, canActivate: [AuthGuard] },
  { path: 'faqs', component: FaqsComponent, canActivate: [AuthGuard] },
  { path: 'crear-faq', component: CrearFaqComponent, canActivate: [AuthGuard] },
  { path: 'app-configuracion-usuario', component: ConfiguracionUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'documentos', component: DocumentosComponent, canActivate: [AuthGuard] },
  { path: 'crear-campo/:idDocumento', component: CrearCampoComponent, canActivate: [AuthGuard] },
  { path: 'crear-documento/:step/:idDocumento', component: CrearDocumentoComponent, canActivate: [AuthGuard] },
  { path: 'crear-documento', component: CrearDocumentoComponent, canActivate: [AuthGuard] },

  /*  RUTAS PUBLICAS  */
  { path: 'login', component: LoginComponent },
  { path: 'app-reestablecer-pass', component: ReestablecerPassComponent },
  { path: 'preguntas-frecuentes', component: PublicFaqsComponent },
  { path: 'borradores', component: BorradoresComponent, canActivate: [AuthGuard] },
  { path: 'nuevo-borrador/:idDocumento', component: CrearBorradorComponent, canActivate: [AuthGuard] },
  { path: 'documentos/:tipo', component: PublicDocumentosComponent },
  { path: 'ver-documento/:idDocumento', component: PreviewDocumentoComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '/inicio' },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
