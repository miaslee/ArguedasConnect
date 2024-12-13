import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Variable para alternar el menú en pantallas pequeñas
  menuResponsive: boolean = false;
  constructor(private sharedService: SharedService) {

  }

  // Función para alternar el menú
  toggleMenu(): void {
    this.menuResponsive = !this.menuResponsive;
  }
  //click en menu
  HomeClick(){
    this.menuResponsive = false;
    this.sharedService.triggerPerfilClick7();
    
  }
  userPerfilClick(){
    this.menuResponsive = false;
    this.sharedService.triggerPerfilClick8();
    
  }
  gruposClick(){
    this.menuResponsive = false;
    this.sharedService.triggerPerfilClick5();
    
  }
  eventosClick(){
    this.menuResponsive = false;
    this.sharedService.triggerPerfilClick6();
    
  }
  cerrarSesion(){
    this.menuResponsive = false;
    this.sharedService.triggerPerfilClick9();
  }

}
