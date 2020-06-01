import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent }  from './app.component';
import { AlertComponent } from './components/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { routing } from './app.routing';
import { CategoriasComponent } from './categorias/categorias.component';
import { ArbolItemComponent } from './categorias/arbol-item/arbol-item.component';
import { CrearCategoriaComponent } from './categorias/crear-categoria/crear-categoria.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        FormsModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        CategoriasComponent,
        ArbolItemComponent,
        CrearCategoriaComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }