import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { routing } from './app.routing';
import { CategoriasComponent } from './categorias/categorias.component';
import { ArbolItemComponent } from './categorias/arbol-item/arbol-item.component';
import { CrearCategoriaComponent } from './categorias/crear-categoria/crear-categoria.component';
import { MenuComponent } from './components/menu/menu.component';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { FaqsComponent } from './faqs/faqs.component';
import { CrearFaqComponent } from './faqs/crear-faq/crear-faq.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { DocumentosComponent } from './documentos/documentos.component';
import { CrearDocumentoComponent } from './documentos/crear-documento/crear-documento.component';
import { CrearCampoComponent } from './documentos/campos/crear-campo/crear-campo.component';
import { CampoItemComponent } from './documentos/campos/campo-item/campo-item.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        FormsModule,
        EditorModule
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
        DocumentosComponent,
        CrearDocumentoComponent,
        CrearCampoComponent,
        CampoItemComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
