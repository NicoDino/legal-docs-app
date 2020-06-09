import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { CategoriasComponent } from './categorias/categorias.component';
import { CrearCategoriaComponent } from './categorias/crear-categoria/crear-categoria.component';
import { FaqsComponent } from './faqs/faqs.component';
import { CrearFaqComponent } from './faqs/crear-faq/crear-faq.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { CrearDocumentoComponent } from './documentos/crear-documento/crear-documento.component';
import { CrearCampoComponent } from './documentos/campos/crear-campo/crear-campo.component';


const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'crear-categoria/:idPadre', component: CrearCategoriaComponent },
    { path: 'faqs', component: FaqsComponent },
    { path: 'crear-faq', component: CrearFaqComponent },
    { path: 'documentos', component: DocumentosComponent },
    { path: 'crear-documento', component: CrearDocumentoComponent },
    { path: 'crear-campo/:idDocumento', component: CrearCampoComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
