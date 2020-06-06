import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule, FormsModule, EditorModule, AppRoutingModule],
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
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
