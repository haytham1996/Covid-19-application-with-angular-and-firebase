import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import firebase from 'firebase/app';
import { from, Observable } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth'
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { News } from './models/news.model';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CovidService {
  private user!: User ; 
  private covidUrl = 'https://api.covid19api.com' ; 

  constructor(private afAuth : AngularFireAuth , private router: Router, private firestore : AngularFirestore , private httpClient: HttpClient) { }
  

  async signInWithGoogle(){
   const credantials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
   this.user = {
     uid: credantials.user.uid ,
     userName: credantials.user.displayName , 
     email: credantials.user.email
   };
   localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData();
    this.router.navigate(["news"]);
   
  }

  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      userName: this.user.userName,
      email: this.user.email
    }, { merge: true});
  }


  getUser(){
    if(this.user == null && this.userSignedIn()){
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    return this.user;
  }

  userSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("user")) != null;
  }

  signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["signin"]);
  }



  getNews(){
    return this.firestore.collection("users")
    .doc(this.user.uid).collection("news", ref => ref.orderBy('date', 'asc')).valueChanges();
  }
  addNews(news: News){
    this.firestore.collection("users").doc(this.user.uid)
    .collection("news").add(news);
  }

  getSummary() : Observable<any[]> {
    
    console.log(this.httpClient.get<any>(`${this.covidUrl}/summary`));
    return this.httpClient.get<any>(`${this.covidUrl}/summary`) ;

  }
 
  getSevenLastDays(): Observable<any[]> {
    let date = new Date() ; 
    let date2 = new Date() ; 
    date2.setDate(date.getDate()-8); 
    date.setDate(date.getDate()-1);
    let from =  date2.toISOString() ; 
    let to   = date.toISOString() ; 
    

    let params = new HttpParams().
    set('from', from)
    .set('to' , to) ; 
    return this.httpClient.get<any>(`${this.covidUrl}/world` , {params}) ;
  }

}