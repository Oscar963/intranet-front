import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { User } from '@interfaces/User';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [RouterOutlet, HeaderComponent, NavbarComponent],
  templateUrl: './index.component.html',
  encapsulation: ViewEncapsulation.None
})
export class IndexAdminComponent implements OnInit {
  private authService = inject(AuthService);
  public user: User = {
    id: 0,
    name: '',
    paternal_surname: '',
    maternal_surname: '',
    rut: '',
    email: '',
    status: 0,
  };

  public nameAvatar: string = '';

  constructor() {}

  ngOnInit() {
    this.authService.getUserObservable().subscribe((user) => {
      this.user = user;
      this.nameAvatar =
        this.user.name.charAt(0) + this.user.paternal_surname.charAt(0);
    });
  }
}
