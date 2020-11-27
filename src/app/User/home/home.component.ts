import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[ ]
})
export class HomeComponent implements OnInit {
  images =[]


  constructor(  private router: Router) {   }

  ngOnInit(): void {

  this.images[0]='https://evolution.edu.au/images/banners/shutterstock_548661166.jpg'
  this.images[1]='https://www.evolution.edu.au/images/reinaldoclassfront1.jpg'
  this.images[2]='https://www.evolution.edu.au/images/rsa_rcg.png'
  }

  loadpage(p:string){
    this.router.navigate([p]);
  }

}
