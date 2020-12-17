import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { User } from '../models/user.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { forkJoin } from 'rxjs';
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
    { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  ];

  user: User; 
  infos : any ; 
  activeCases : any ; 
  recoveryRate : any ; 
  mortalityRate : any ; 
  date = new Date() ; 
  lastSevenDaysData : any ; 

  constructor(public covidService : CovidService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

  ngOnInit(): void {
     let summary = this.covidService.getSummary() ; 
     let lastDays=this.covidService.getSevenLastDays() ; 
    this.user = this.covidService.getUser() ;

   forkJoin(summary , lastDays).subscribe(([call1Response , call2Response])=>{
    this.infos = call1Response;
    this.date = this.infos.Date ; 
    this.activeCases=  this.infos.Global.TotalConfirmed - (this.infos.Global.TotalRecovered +this.infos.Global.TotalDeaths) ; 
    this.recoveryRate= ((this.infos.Global.TotalRecovered / this.infos.Global.TotalConfirmed) * 100).toFixed(2) ; 
    this.mortalityRate= ((this.infos.Global.TotalDeaths / this.infos.Global.TotalConfirmed) * 100).toFixed(2) ;
    this.pieChartData=[this.infos.Global.TotalDeaths , this.infos.Global.TotalRecovered , this.activeCases ];
    


    this.lastSevenDaysData=call2Response;

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (let i= 7 ; i>=1 ; i--) 
    {
      let dateForChart = new Date() ;
      dateForChart.setDate(dateForChart.getDate()-i); 
      console.log(dateForChart); 
      let dayName=  ("0" + dateForChart.getDate()).slice(-2);
      let monthName = months[dateForChart.getMonth()]; 
      let d =dayName+" "+monthName ; 
      this.barChartLabels.push(d) ; 
     
    } 
   
  
   })
  }

}
