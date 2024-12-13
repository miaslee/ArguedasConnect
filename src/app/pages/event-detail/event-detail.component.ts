import { CommonModule, NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {
  remainingTime : string;
  isFinalized: boolean;
  eventos: Evento[] = []; // Lista de eventos tipada con la interfaz
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<EventDetailComponent>) {
   // console.log(data.event); // Aquí tienes acceso al objeto `evt`
    this.remainingTime = this.calculateTimeLeft(data.event.date, data.event.time)// Calcular tiempo restante
    this.isFinalized = new Date().getTime() > new Date(`${data.event.date}T${data.event.time}`).getTime() // Validar si ya pasó


  }
  cerrar(){
    this.dialog.close();
  }

  calculateTimeLeft(date: string, time: string): string {
    // Verificar que la fecha y hora sean válidas
    if (!date || !time) {
      console.error("Fecha u hora inválida:", date, time);
      return "Formato de fecha u hora inválido";
    }
  
    // Combinar fecha y hora
    const eventDateTime = new Date(`${date}T${time}`);
    if (isNaN(eventDateTime.getTime())) {
      console.error("Error al crear la fecha del evento:", `${date}T${time}`);
      return "Formato de fecha u hora inválido";
    }
  
    const now = new Date();
    const diff = eventDateTime.getTime() - now.getTime();
  
    // Si el evento ya pasó
    if (diff <= 0) {
      return "Finalizado";
    }
  
    // Calcular tiempo restante en diferentes unidades
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); // Aproximación de 30 días por mes
    const years = Math.floor(days / 365); // Aproximación de 365 días por año
  
    // Devolver el tiempo en la unidad más relevante
    if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} mes${months > 1 ? 'es' : ''}`;
    } else if (weeks > 0) {
      return `${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else if (days > 0) {
      return `${days} día${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      return "Menos de un minuto";
    }
  }
}

// Interfaz para los eventos
export interface Evento {
  id: string;           // ID del documento generado por Firestore
  title: string;        // Título del evento
  description: string;  // Descripción del evento
  date: string;         // Fecha del evento
  creator: string;      // Creador del evento
  time: string;         // Hora del evento
  members: string[];    // Lista de miembros
  isFinalized: boolean; // Si el evento ya finalizó
  remainingTime?: string; // Tiempo restante en formato texto (opcional)
  image ?: string;
  lugar : string
}
