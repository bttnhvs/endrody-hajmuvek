import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Az alkalmazás belépési pontja: nincs NgModule, a gyökérkomponenst
// (App) közvetlenül indítjuk el, a globális beállításokkal (appConfig).
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
