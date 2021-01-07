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
import { Infos } from '../models/infos.model';


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

  constructor(public covidService : CovidService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

  ngOnInit(): void {

    
     let summary = this.covidService.getSummary() ; 
     let lastDays=this.covidService.getSevenLastDays() ; 
     let getDataSince = this.covidService.getDataSince() ; 
     let getAllNews = this.covidService.getAllNews() ; 

     this.user = this.covidService.getUser() ;
    

   forkJoin(summary , lastDays , getDataSince , getAllNews).subscribe(([call1Response , call2Response , call3Response , call4Response])=>{
    

    this.infos = call1Response.Global  ;
    this.news = call4Response ; 
    console.log("*****************") ;
    this.date = this.infos.Date ; 
    this.activeCases=  this.infos.TotalConfirmed -  this.infos.TotalRecovered +this.infos.TotalDeaths ; 
    this.recoveryRate= ((this.infos.TotalRecovered / this.infos.TotalConfirmed) * 100).toFixed(2) ; 
    this.mortalityRate= ((this.infos.TotalDeaths / this.infos.TotalConfirmed) * 100).toFixed(2) ;
    this.pieChartData=[this.infos.TotalDeaths , this.infos.TotalRecovered , this.activeCases ];
    
   

    this.lastSevenDaysData=call2Response;
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 
    for (let i= 7 ; i>0 ; i--) 
    {
      let dateForChart = new Date() ;
      dateForChart.setDate(dateForChart.getDate()-i); 
    //  console.log(this.lastSevenDaysData.NewDeaths); 
      let dayName=  ("0" + dateForChart.getDate()).slice(-2);
      let monthName = months[dateForChart.getMonth()]; 
      let d =dayName+" "+monthName ; 
      this.barChartLabels.push(d) ; 
     
    } 
     let newConfirmed = [];
     let newRecoverd = [];
     let newDeaths = [];
    // console.log(this.lastSevenDaysData);
     this.lastSevenDaysData.forEach(element => {
       newConfirmed.push(element.NewConfirmed);
       newRecoverd.push(element.NewRecovered);
       newDeaths.push(element.NewDeaths);
     }); 

     this.barChartData[2].data=newConfirmed;
     this.barChartData[1].data=newRecoverd;
     this.barChartData[0].data=newDeaths;

     this.dataSince = call3Response ;  
     this.chartReady = true ; 

      for(let i=251 ; i>=0 ; i-=7)
      { 
       let dateForCh= new Date() ; 
       
        dateForCh.setDate(dateForCh.getDate()-i); 
       
      
        let dayName=  ("0" + dateForCh.getDate()).slice(-2);
        let monthName = months[dateForCh.getMonth()]; 
        let d =dayName+" "+monthName ;
        // console.log(d)
        this.lineChartLabels.push(d) ; 
        
      }
      
     let totalDeaths = [];
     let totalRecoverd = [];
     let totalCases = [];
     /*let totalDeath =0 ; 
     let totalRecovered=0 ; 
     let totalCase = 0 ; */
    
     for(let i = 0 ; i<251 ; i+=7)
     {  // console.log(this.dataSince[i])
      

       totalDeaths.push(this.dataSince[i].TotalDeaths);
       totalRecoverd.push(this.dataSince[i].TotalRecovered);
       totalCases.push(this.dataSince[i].TotalConfirmed);
     }
     this.lineChartData[0].data=totalDeaths;
     this.lineChartData[1].data=totalRecoverd;
     this.lineChartData[2].data=totalCases;


     this.countriesData = call1Response.Countries ; 
     
     
    
     
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
