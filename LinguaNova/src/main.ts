import 'zone.js';

// Some browser bundles (e.g. STOMP/SockJS deps) may reference Node's `global`.
// Provide a safe browser alias to avoid: "ReferenceError: global is not defined".
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
