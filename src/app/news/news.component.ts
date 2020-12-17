import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { News } from '../models/news.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  user: User;
  news: News[];
  date:any; 
  description: any ; 
  country: any ; 


  constructor(public covidService : CovidService) { }

  ngOnInit(): void {
    this.user = this.covidService.getUser();
    this.covidService.getNews()
    .subscribe((news: News[])=>{
      this.news = news;
    });
   
  }

  addNews(){
    let news: News = {
      date: new Date(this.date),
      description: this.description,
      country: this.country
    };
    this.covidService.addNews(news);
    this.date = undefined;
    this.description = undefined;
    this.country = undefined;
  }



}
