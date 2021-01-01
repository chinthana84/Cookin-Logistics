import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from '../../_services/error-handler.service';

@Component({
  selector: 'app-internal-server',
  templateUrl: './internal-server.component.html',
  styleUrls: ['./internal-server.component.css']
})
export class InternalServerComponent implements OnInit {
  public errorMessage: string = "500 SERVER ERROR, CONTACT ADMINISTRATOR!!!!";

  constructor(private route: ActivatedRoute,private errorServer:ErrorHandlerService) { }

  ngOnInit() {
    this.errorMessage=this.errorServer.errorMessage;
    //var url = this.route.parent.snapshot.url[2].path;
  }

}
