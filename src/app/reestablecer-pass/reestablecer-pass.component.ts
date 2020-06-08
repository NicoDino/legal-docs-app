import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reestablecer-pass',
  templateUrl: './reestablecer-pass.component.html',
  styleUrls: ['./reestablecer-pass.component.css'],
})
export class ReestablecerPassComponent implements OnInit {
  resetView = false;

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {}

  toggleView() {
    this.resetView = !this.resetView;
  }
}
