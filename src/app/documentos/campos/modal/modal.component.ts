import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'modal-component',
  templateUrl: 'modal.component.html',
})
export class ModalComponent implements OnInit {
  parameter: number;
  constructor(private bsModalRef: BsModalRef) {}

  ngOnInit() {
    console.log(this.parameter);
    debugger;
  }

  confirm() {
    // do stuff
    this.close();
  }

  close() {
    this.bsModalRef.hide();
  }
}
