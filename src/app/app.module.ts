import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { Routes, RouterModule, CanLoad, Route, UrlSegment } from "@angular/router";
import { ThemeRoutingModule } from './core/theme/theme-routing.module';
import { ScriptLoaderService } from './core/_services/script-loader.service';
import { AuthModule } from './core/auth/auth.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { Observable } from 'rxjs';


export function token() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.accessToken;
}


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeRoutingModule,
        AuthModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: token
            }
        }),
        HttpClientModule,
        SharedModule,
        CoreModule,
        RouterModule,
        CKEditorModule
    ],
    providers: [ScriptLoaderService],
    bootstrap: [AppComponent]
})
export class AppModule { }