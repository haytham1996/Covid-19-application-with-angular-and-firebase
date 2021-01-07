import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { CovidService } from '../covid.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  currentCountry : any ; 
  infos : any; 


  constructor(private covidService : CovidService , private route : ActivatedRoute , private router : Router ) { }

  ngOnInit(): void {

    this.currentCountry = this.route.snapshot.paramMap.get('country') ;
    console.log(this.currentCountry) 
    this.covidService.getSummary().subscribe( data => {
    this.infos=data.Countries  
    console.log(this.infos) ; 
    }) ; 
    
  }

}
