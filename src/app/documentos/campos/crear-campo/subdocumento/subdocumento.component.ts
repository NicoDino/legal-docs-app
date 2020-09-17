import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-subdocumento',
  templateUrl: './subdocumento.component.html',
  styleUrls: ['./subdocumento.component.css'],
})
export class SubdocumentoComponent implements OnInit {
  @Input() opcionForm: FormGroup;
  @Input() idx: number;
  @Input() disableRemove: boolean;
  @Output() idxToRemove: EventEmitter<number> = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void {}
}
