import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '../modal-dialog.service';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {
  public modalOpen: boolean;
  constructor(private modalService: ModalDialogService) { }

  ngOnInit() {

  this.modalService.getModal().subscribe((isOpen) => {
      this.modalOpen = isOpen as boolean;
    });
  }

  closeModal() {
    this.modalService.close();
  //  this.sub.unsubscribe();
  }

}
