import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-index',
  imports: [HeaderComponent,FooterComponent, NavbarComponent,RouterOutlet],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexWebComponent {

}
