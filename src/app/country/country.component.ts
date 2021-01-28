import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { element } from 'protractor';
import { forkJoin } from 'rxjs';
import { CovidService } from '../covid.service';
import { Country } from '../models/Countru.model';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {


  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], ['Active Cases']];
  public pieChartData: SingleDataSet ;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Total Deaths ' },
    {data : [], label:'Total Recovery'},  
    {data:[], label:'Total Cases'},  

  ];


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

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
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
  currentCountry : any ; 
  CountriesArray : any; 
  country : Country = new Country() ; 
  slug : string ; 
  countryData : any  ;
  summary : any ;
  mortalityRate: string ; 
  recoveryRate:string  ;
  activceCases:any  ;    
  chartReady:boolean=false ; 
  lastSevenDays: any ;
  lastSevenDaysArray: any ;
  getAllNews: any[] = []
  countryNews:any[] = []
  countryName: any ; 
  checkNews: Boolean = false 
  constructor(private covidService : CovidService , private route : ActivatedRoute , private router : Router ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

  ngOnInit(): void {
    let lastDays=this.covidService.getSevenLastDays() ;  
      console.log(this.route.snapshot.paramMap.get('country'))
    this.currentCountry = this.route.snapshot.paramMap.get('country') ;
    console.log(this.currentCountry)     
    this.getAllNews = this.covidService.getAllNews() ;

    forkJoin({summary : this.covidService.getSummary() ,
             countryData : this.covidService.getAllDataForCountry(this.currentCountry) ,
              lastDays: this.covidService.getSevenLastDays(),}).subscribe(response => {

              this.CountriesArray=Object.values(response.summary["Countries"]) ; 
              this.CountriesArray.forEach(element => {
      
       
                if ( element.Slug == this.currentCountry)
                {   
                  console.log(element.Country)
                  this.countryName=element.Country
                  this.country.NewConfirmed = element.NewConfirmed  ;
                  this.country.NewDeaths = element.NewDeaths ;
                  this.country.NewRecovered = element.NewRecovered ; 
                  this.country.TotalDeaths = element.TotalDeaths ; 
                  this.country.TotalConfirmed = element.TotalConfirmed ; 
                  this.country.TotalRecovered  = element.TotalRecovered ; 
                  console.log("added Successufully")
                }
              
              }) 
              
              console.log(this.country)
    this.activceCases=  this.country.TotalConfirmed -  this.country.TotalRecovered +this.country.TotalDeaths ; 
    this.recoveryRate = ((this.country.TotalRecovered / this.country.TotalConfirmed) * 100).toFixed(2) ; 
    this.mortalityRate= ((this.country.TotalDeaths / this.country.TotalConfirmed) * 100).toFixed(2) ;
    this.pieChartData=[this.country.TotalDeaths , this.country.TotalRecovered , this.activceCases];
              
              this.countryData = response.countryData ; 
              this.chartReady = true ; 
              console.log( this.countryData)
              this.lastSevenDays=response.lastDays;
              this.barChartLabels= Object.keys(this.lastSevenDays["cases"]) ; 
     
              this.lastSevenDaysArray= this.countryData.slice(Math.max(this.countryData.length - 8 , 1))
              console.log(this.lastSevenDaysArray)
              let newConfirmed: [] = [];
              let newRecoverd: [] = [];  
              let newDeaths:  [] = [];
              for (var element in this.lastSevenDaysArray)
              {
                  newConfirmed.push(this.lastSevenDaysArray[element].Confirmed)  
                  newRecoverd.push(this.lastSevenDaysArray[element].Recovered)
                  newDeaths.push(this.lastSevenDaysArray[element].Deaths)

              }
                
            
              console.log(newConfirmed)
              console.log(newRecoverd)
              console.log(newDeaths)
         
              this.barChartData[2].data=newConfirmed;
              this.barChartData[1].data=newRecoverd;
              this.barChartData[0].data=newDeaths;
         
              let dateForChart= [] ; 

        
      
     let totalDeaths = [];
     let totalRecoverd = [];
     let totalCases = [];

     for(let i=0; i<=this.countryData.length;i+=7)
     {
       let day = new Date(Date.now() - i* 24 *60 * 60 *1000).toString().split(' ').splice(1,2).reverse().join(' '); 
       this.lineChartLabels.push(day)
     }
     for (let element=0; element<this.countryData.length;element+=7)
     {  console.log(this.countryData[element].Date)
        //dateForChart.push(this.countryData[element].Date)
        totalCases.push(this.countryData[element].Active) ; 
         totalRecoverd.push(this.countryData[element].Recovered)
         totalDeaths.push(this.countryData[element].Deaths)   

     }
    
     console.log(this.lineChartLabels)
     this.lineChartData[0].data= totalDeaths; 
     this.lineChartData[1].data=totalRecoverd;
     this.lineChartData[2].data=totalCases; 

     console.log(this.getAllNews)
     
     for(var element in this.getAllNews){
       if(this.getAllNews[element].country == this.countryName)
       {this.countryNews.push(this.getAllNews[element])
        this.checkNews=true ; 
      }
     }
    }) ; 
   
    
  }
 
}
  