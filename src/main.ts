import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideRouter, withRouterConfig} from '@angular/router';
import { appRoutes } from './app/app.routes';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import { environment } from './app/environments/environment.development';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';
import { provideTranslations } from './app/translate.providers';


function isFirebaseConfigValid(config: any): boolean {
  return config && config.apiKey && config.authDomain && config.projectId;
}
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    ...provideTranslations,
    ...(isFirebaseConfigValid(environment.firebaseConfig)
      ? [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())
      ]
      : [])
  ]
}).catch(err => console.error(err));
