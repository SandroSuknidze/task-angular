import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit{
  isAuthenticated!: boolean;
  userEmail!: string;

  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
      this.userEmail = this.authService.userEmail;
    })
  }

  logout() {
    this.authService.logout();
  }
}
