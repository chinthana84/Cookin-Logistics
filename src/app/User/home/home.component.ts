import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityModel } from 'src/app/models/Security.model';
import { CommonService } from 'src/app/_shared/_services/common.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[ ]
})
export class HomeComponent implements OnInit {
  images =[]



  ngOnInit(): void {


  this.images[0]='https://evolution.edu.au/images/banners/shutterstock_548661166.jpg'
  this.images[1]='https://www.evolution.edu.au/images/reinaldoclassfront1.jpg'
  this.images[2]='https://www.evolution.edu.au/images/rsa_rcg.png'
  }

  loadpage(p:string){
    this.route.navigate([p]);
  }

  securityModel: SecurityModel;
  constructor(
    private route:Router,
    private activatedRoute: ActivatedRoute,
    private securityService: CommonService
  ) {
    this.securityModel = securityService.securityModel;
    console.log(
      `From snapshot ${activatedRoute.snapshot.paramMap.get("name")}`
    );
    activatedRoute.paramMap.subscribe(
      (item) => {
        console.log(`From PramMap ${item.get("name")}`);
      },
      (error) => error,
      () => {}
    );
  }

}
