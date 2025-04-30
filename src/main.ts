import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideRouter, withRouterConfig} from '@angular/router';
import { appRoutes } from './app/app.routes';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import { environment } from './app/environments/environment.development';
import {getAuth, provideAuth} from '@angular/fire/auth';
function isFirebaseConfigValid(config: any): boolean {
  return config && config.apiKey && config.authDomain && config.projectId;
}
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    ...(isFirebaseConfigValid(environment.firebaseConfig)
      ? [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())
      ]
      : []),
  ],
}).catch(err => console.error(err));
