import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule, isDevMode } from "@angular/core";
import { AppRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { MainLayoutComponent } from "./shared/components/main-layout/main-layout.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { ProductDetailsComponent } from "./shared/components/product-details/product-details.component";
import { OrderPageComponent } from "./order-page/order-page.component";
import { HttpClientModule } from "@angular/common/http";
import { ProductComponent } from "./shared/components/product/product.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";
import { LoginPageComponent } from "./login-page/login-page.component";
import { AuthDirective } from "./shared/directives/auth.directive";
import { environment } from "src/environments/environment";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideDatabase, getDatabase } from "@angular/fire/database";
import {
  provideFunctions,
  getFunctions,
  connectFunctionsEmulator,
} from "@angular/fire/functions";
import { QuillModule } from "ngx-quill";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { GlobalErrorHandler } from "./shared/helper/global-error-handler";

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
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: "toast-top-right",
      // preventDuplicates: true,
    }),
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
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        console.log("Run Function Emulator!");
        connectFunctionsEmulator(functions, "127.0.0.1", 5001);
      }
      return functions;
    }),
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
