import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent implements OnInit {
  errorMessage: string = 'An unexpected error occurred.';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        this.errorMessage = params['message'];
      }
    });
  }
}
