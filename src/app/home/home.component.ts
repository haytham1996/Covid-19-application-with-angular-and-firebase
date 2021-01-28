import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { User } from '../models/user.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { forkJoin, Observable } from 'rxjs';
import {ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { News } from '../models/news.model';
import { element } from 'protractor';
import { Global } from '../models/infos.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], ['Active Cases']];
  public pieChartData: SingleDataSet ;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];



  barChartOptions: ChartOptions = {
    responsive: true,
  };
  chartLabel : [] ; 
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [], label: 'Daily Deaths' } , 
    { data: [], label: 'Daily Recovered' } , 
    { data: [], label: 'Daily New Cases' } 
  ];



  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Total Deaths ' },
    {data : [], label:'Total Recovery'},  
    {data:[], label:'Total Cases'},  

  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
            
              
          }
      }] ,

      xAxes: [{
        type: 'time',
        
        }]
      
  }
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  
  

  user: User; 
  infos : any ; 
  activeCases : any ; 
  recoveryRate : any ; 
  mortalityRate : any ; 
  date = new Date() ; 
  lastSevenDaysData : any ; 
  dataSince: any  ;
  country : any ; 
  newCases:any ; 
  countriesData: any; 
  p: number ; 
  news : any ;
  new:News ; 
  chartReady : boolean = false ; 
  getAllNews: any[] = []
  global : Global = new Global()

  constructor(public covidService : CovidService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

  ngOnInit(): void {

      
     let summary = this.covidService.getSummary() ; 
     let lastDays=this.covidService.getSevenLastDays() ; 
     let getDataSince = this.covidService.getDataSince() ; 
     this.getAllNews = this.covidService.getAllNews() ; 

     this.user = this.covidService.getUser() ;
    

   forkJoin({ summary: this.covidService.getSummary(),
   lastDays: this.covidService.getSevenLastDays(),
   getDataSince: this.covidService.getDataSince(),
   //getAllNews:this.covidService.getAllNews(),
  }).subscribe(response=>{
    

    this.infos = response.summary ;

    this.global.NewConfirmed = this.infos.Global.NewConfirmed ; 
    this.global.NewDeaths = this.infos.Global.NewDeaths
    this.global.NewRecovered = this.infos.Global.NewRecovered
    this.global.TotalConfirmed = this.infos.Global.TotalConfirmed
    this.global.TotalDeaths=  this.infos.Global.TotalDeaths
    this.global.TotalRecovered = this.infos.Global.TotalRecovered ;
    
  //  this.news = response.getAllNews ; 
    console.log(this.infos)
    this.date = this.infos.Date ; 
    this.activeCases=  this.infos.Global.TotalConfirmed -  this.infos.Global.TotalRecovered +this.infos.Global.TotalDeaths ; 
    this.recoveryRate = ((this.infos.Global.TotalRecovered / this.infos.Global.TotalConfirmed) * 100).toFixed(2) ; 
    this.mortalityRate= ((this.infos.Global.TotalDeaths / this.infos.Global.TotalConfirmed) * 100).toFixed(2) ;
    this.pieChartData=[this.infos.Global.TotalDeaths , this.infos.Global.TotalRecovered , this.activeCases];
    console.log(this.global)
   

    this.lastSevenDaysData=response.lastDays;
    console.log(this.lastSevenDaysData)
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 
   
      this.barChartLabels= Object.keys(this.lastSevenDaysData["cases"]) ; 
     
  
     let newConfirmed = [];
     let newRecoverd = [];
     let newDeaths = [];
      
     newConfirmed = Object.values(this.lastSevenDaysData["cases"]) ; 
     newRecoverd = Object.values(this.lastSevenDaysData["recovered"]) ; 
     newDeaths = Object.values(this.lastSevenDaysData["deaths"])

     this.barChartData[2].data=newConfirmed;
     this.barChartData[1].data=newRecoverd;
     this.barChartData[0].data=newDeaths;

     this.dataSince = response.getDataSince ;  
     console.log(this.dataSince)
     this.chartReady = true ; 

      let dateForChart= [] ; 

      dateForChart =Object.keys(this.dataSince["cases"])  ; 
      console.log(dateForChart)
      this.lineChartLabels = dateForChart ; 
      
     let totalDeaths = [];
     let totalRecoverd = [];
     let totalCases = [];
     /*let totalDeath =0 ; 
     let totalRecovered=0 ; 
     let totalCase = 0 ; */

     totalDeaths = Object.values(this.dataSince["deaths"])  ; 
     totalRecoverd = Object.values(this.dataSince["recovered"])   ; 
     totalCases = Object.values(this.dataSince["cases"])
    
     
     this.lineChartData[0].data= totalDeaths;
     this.lineChartData[1].data=totalRecoverd;
     this.lineChartData[2].data=totalCases;


     this.countriesData = this.infos.Countries ; 

     console.log(this.countriesData)  
     
     
    
     
   }) ; 

   
  }
   
  Search(){
    if (this.country ==""){
      this.ngOnInit() ; 
    }else {
      console.log(this.countriesData)
      this.countriesData.filter(res=> {
        console.log(res)
        return res.Country.toLocaleLowerCase().match(this.country.toLowerCase()) ; 
      })
    }
  }

  key : string = 'id' ; 
  reverse:boolean =false ; 

  sort(key){
    this.key = key ; 
    this.reverse=!this.reverse ; 
    console.log(this.key) ; 
  }
 
 

}
