import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire'; 
import {AngularFirestoreModule} from '@angular/fire/firestore'; 
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { CountryComponent } from './country/country.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ChartsModule} from 'ng2-charts' ; 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewsComponent,
    CountryComponent,
    NavbarComponent,
    FooterComponent, 
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FontAwesomeModule,
    AngularFirestoreModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
