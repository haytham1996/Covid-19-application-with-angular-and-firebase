import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CountryComponent } from './country/country.component';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { SecurePagesGuard } from './secure-pages.guard';
import {SigninComponent} from './signin/signin.component';
const routes: Routes = [
  {path:"signin", component: SigninComponent , canActivate: [SecurePagesGuard]},
  {path:"", component: HomeComponent},
  {path:"country/:country", component: CountryComponent},
  {path:"news", component: NewsComponent , canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
