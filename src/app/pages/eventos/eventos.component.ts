import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [ NgFor, CommonModule,
    FormsModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent {
  searchTerm: string = ''; // Variable para el término de búsqueda
  events = [
    {
      title: 'Taller de Programación',
      description: 'Aprende las bases de Angular y TypeScript.',
      date: '2024-11-25',
      time: '10:00 AM - 1:00 PM',
      image: 'https://via.placeholder.com/300x150?text=Programación'
    },
    {
      title: 'Conferencia UX/UI',
      description: 'Descubre las últimas tendencias en diseño.',
      date: '2024-11-28',
      time: '2:00 PM - 4:00 PM',
      image: 'https://via.placeholder.com/300x150?text=UX/UI'
    },
    {
      title: 'Simposio de Matemáticas',
      description: 'Explora temas avanzados en cálculo diferencial.',
      date: '2024-12-01',
      time: '9:00 AM - 12:00 PM',
      image: 'https://via.placeholder.com/300x150?text=Matemáticas'
    }
  ];
  filteredEvents() {
    return this.events.filter(event =>
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
