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

const appRoutes: Routes = [
  /* RUTAS PRIVADAS */
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
  { path: 'crear-categoria/:idPadre', component: CrearCategoriaComponent, canActivate: [AuthGuard] },
  { path: 'faqs', component: FaqsComponent, canActivate: [AuthGuard] },
  { path: 'crear-faq', component: CrearFaqComponent, canActivate: [AuthGuard] },
  { path: 'app-configuracion-usuario', component: ConfiguracionUsuarioComponent, canActivate: [AuthGuard] },
  /*  RUTAS PUBLICAS  */
  { path: 'login', component: LoginComponent },
  { path: 'app-reestablecer-pass', component: ReestablecerPassComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}
