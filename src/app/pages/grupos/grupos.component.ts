import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [NgFor, CommonModule,
    FormsModule],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})
export class GruposComponent {
  searchTerm: string = ''; // Variable para el término de búsqueda
  groups = [
    {
      name: 'Grupo de Programación',
      description: 'Discusión sobre desarrollo web y buenas prácticas.',
      members: 120,
      image: 'https://via.placeholder.com/300x150?text=Programación'
    },
    {
      name: 'Grupo de Diseño UX/UI',
      description: 'Comparte ideas sobre diseño de interfaces atractivas.',
      members: 95,
      image: 'https://via.placeholder.com/300x150?text=UX/UI'
    },
    {
      name: 'Grupo de Matemáticas',
      description: 'Preparación para exámenes de cálculo avanzado.',
      members: 78,
      image: 'https://via.placeholder.com/300x150?text=Matemáticas'
    }
  ];
  filteredGroups() {
    return this.groups.filter(group =>
      group.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
