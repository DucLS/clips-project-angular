import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

let isAppInit = false;

if (environment.production) {
  enableProdMode();
}

firebase.initializeApp(environment.firebase);

firebase.auth().onAuthStateChanged(() => {
  if (!isAppInit) {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  }

  isAppInit = true;
});
