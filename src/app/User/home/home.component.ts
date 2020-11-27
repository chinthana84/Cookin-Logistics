import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[NgbCarouselConfig]
})
export class HomeComponent implements OnInit {
  images =[]


  constructor(  private router: Router,config: NgbCarouselConfig) { config.interval = 2000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false; }

  ngOnInit(): void {

  this.images[0]='https://evolution.edu.au/images/banners/shutterstock_548661166.jpg'
  this.images[1]='https://www.evolution.edu.au/images/reinaldoclassfront1.jpg'
  this.images[2]='https://www.evolution.edu.au/images/rsa_rcg.png'
  }

  loadpage(p:string){
    this.router.navigate([p]);
  }

}
