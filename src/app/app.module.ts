import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule, isDevMode } from "@angular/core";

import { AppRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { MainLayoutComponent } from "./shared/components/main-layout/main-layout.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { ProductDetailsComponent } from "./shared/components/product-details/product-details.component";
import { OrderPageComponent } from "./order-page/order-page.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { QuillModule } from "ngx-quill";
import { ProductComponent } from "./shared/components/product/product.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";
import { LoginPageComponent } from "./login-page/login-page.component";
import { AuthDirective } from "./shared/directives/auth.directive";

import { environment } from "src/environments/environment";
import { provideFirebaseApp, initializeApp as initializeFirebaseApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideDatabase, getDatabase } from "@angular/fire/database";
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { AuthService } from "./shared/services/auth.service";
import { initializeApp } from "./app.initializer";

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MainPageComponent,
    ProductDetailsComponent,
    OrderPageComponent,
    LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutes,
    HttpClientModule,
    QuillModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
    ProductComponent,
    AuthDirective,
  ],
  providers: [
	AuthService,
    provideFirebaseApp(() => initializeFirebaseApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
	provideFunctions(() => getFunctions()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
