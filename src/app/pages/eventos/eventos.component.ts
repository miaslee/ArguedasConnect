import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  showCreateEventModal: boolean = false;
  newEvent: any = { title: '', description: '', date: '', time: '', members: [], creator: 'USER_ID' , lugar:''};
  firestore: FirebaseTSFirestore = new FirebaseTSFirestore();
  auth: FirebaseTSAuth = new FirebaseTSAuth();
  currentUser: string = '';
  searchTerm: string = ''; // Variable para el término de búsqueda
  eventos: Evento[] = []; // Lista de eventos tipada con la interfaz

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getAuth().currentUser?.uid || '';
    this.listEvents();
    // Revisar y eliminar eventos expirados cada 5 minutos
    setInterval(() => {
      this.autoDeleteExpiredEvents();
    }, 5 * 60 * 1000); // Cada 5 minutos
  }
  joinEvent(eventId: string | undefined) {
    if (!eventId) {
      console.error("El ID del evento es inválido o está vacío.");
     // alert("Ocurrió un error al intentar unirte al evento.");
      return;
    }
  
    const userId = this.auth.getAuth().currentUser?.uid;
    if (!userId) {
      //alert("Debes iniciar sesión para unirte a un evento.");
      return;
    }
  
    this.firestore.getDocument({
      path: ["eventos", eventId],
      onComplete: (result) => {
        const event = result.data();
        if (event) {
          const members = Array.isArray(event['members']) ? event['members'] : [];
          if (!members.includes(userId)) {
            members.push(userId);
            this.firestore.update({
              path: ["eventos", eventId],
              data: { members },
              onComplete: () => {
                this.showNotification("evt-join")
                //alert("Te has unido al evento con éxito.");
                this.listEvents();
              },
              onFail: (error) => {
                console.error("Error al actualizar los miembros del evento:", error);
              }
            });
          } else {
            this.showNotification("evt-joined")
            //alert("Ya eres miembro de este evento.");
          }
        } else {
          console.error("El evento no existe.");
        }
      },
      onFail: (error) => {
        console.error("Error al obtener el evento:", error);
      }
    });
  }
  

  // Filtrar eventos por término de búsqueda
  filteredEvents() {
    return this.eventos.filter(event =>
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Abrir o cerrar modal
  toggleCreateEventModal() {
    this.showCreateEventModal = !this.showCreateEventModal;
  }

  // Crear un evento
  createEvent() {
    const userId = this.auth.getAuth().currentUser?.uid;
    if (!userId) {
      alert("Debes iniciar sesión para crear un evento.");
      return;
    }
  
    // Validar que todos los campos estén completos
    if (!this.newEvent.title || !this.newEvent.description || !this.newEvent.date || !this.newEvent.time) {
     // alert("Todos los campos son obligatorios para crear un evento.");
      this.showNotification("evt-vacio")
      return;
    }
  
    // Crear un objeto de fecha y hora para el evento
    const eventDateTime = new Date(`${this.newEvent.date}T${this.newEvent.time}`);
    const now = new Date();
  
    // Validar si la fecha y hora son válidas
    if (isNaN(eventDateTime.getTime())) {
      //alert("La fecha u hora del evento no son válidas.");
      this.showNotification("evt-hfi")
      return;
    }
  
    // Validar que el evento sea al menos 30 minutos en el futuro
    const thirtyMinutesInMilliseconds = 30 * 60 * 1000; // 30 minutos en milisegundos
    if (eventDateTime.getTime() - now.getTime() <= thirtyMinutesInMilliseconds) {
     // alert("El evento debe programarse al menos 30 minutos en el futuro.");
     this.showNotification("evt-30")
      return;
    }
  
    // Construir el objeto del evento
    const event = {
      title: this.newEvent.title,
      description: this.newEvent.description,
      date: this.newEvent.date, // YYYY-MM-DD
      time: this.newEvent.time, // HH:mm
      members: [userId],
      creator: userId,
      lugar : this.newEvent.lugar
    };
  
    // Guardar el evento en Firestore
    this.firestore.create({
      path: ["eventos"],
      data: event,
      onComplete: (docId) => {
       
       this.showNotification("evt-creado")
        //alert(`Evento creado con éxito. ID: ${docId}`);
        this.newEvent = { title: '', description: '', date: '', time: '', members: [], creator: 'USER_ID' , lugar:''};
        this.toggleCreateEventModal();
        this.listEvents();
      },
      onFail: (error) => {
        console.error("Error al crear el evento:", error);
      }
    });
  }
  
  showNotification(valor: string): string {

    this.sharedService.sendId1(valor); // Envía el ID a través del servicio
    return valor
  }
  
  // Cargar eventos desde Firestore
  listEvents() {
    this.firestore.getCollection({
      path: ["eventos"],
      where: [new OrderBy("date", "asc")],
      onComplete: (result) => {
        this.eventos = result.docs.map(doc => {
          const data = doc.data();
  
          // Validar que los campos 'date' y 'time' existan
          if (!data['date'] || !data['time']) {
            console.warn(`Evento con ID ${doc.id} tiene una fecha u hora inválida:`, data);
          }
  
          // Crear un objeto del tipo Evento
          const evento: Evento = {
            id: doc.id, // ID del documento
            title: data['title'] || 'Evento sin título',
            description: data['description'] || 'Sin descripción',
            date: data['date'] || '', // Fecha del evento
            time: data['time'] || '', // Hora del evento
            creator: data['creator'] || '',
            members: data['members'] || [],
            isFinalized: new Date().getTime() > new Date(`${data['date']}T${data['time']}`).getTime(), // Validar si ya pasó
            remainingTime: this.calculateTimeLeft(data['date'], data['time']), // Calcular tiempo restante
            lugar : data['lugar']
          };
  
          return evento;
        });
  
        //console.log("Eventos cargados:", this.eventos);
      },
      onFail: (error) => {
       // console.error("Error al listar los eventos:", error);
      }
    });
  }
  
  
  autoDeleteExpiredEvents() {
    const now = new Date().getTime();
  
    this.eventos.forEach(event => {
      // Combinar fecha y hora para obtener el timestamp del evento
      const eventDateTime = new Date(`${event.date}T${event.time}`).getTime();
      
      // Añadir 30 minutos (en milisegundos) al tiempo del evento
      const expirationTime = eventDateTime + (30 * 60 * 1000); // 30 minutos en milisegundos
  
      // Si el tiempo actual es mayor al tiempo de expiración, eliminar el evento
      if (now >= expirationTime) {
        console.log(`Eliminando evento expirado (30 minutos después): ${event.id}`);
        this.deleteEvent(event.id);
      }
    });
  }
  
  

  // Calcular tiempo restante
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
  
  
  
  

  // Eliminar evento
  deleteEvent(eventId: string) {
    if (!eventId) {
      console.error("El ID del evento es inválido o está vacío.");
     // alert("Ocurrió un error al intentar eliminar el evento.");
      return;
    }

    this.firestore.delete({
      path: ["eventos", eventId],
      onComplete: () => {
        this.showNotification("evt-delete")
       
        this.listEvents();
      },
      onFail: (error) => {
        console.error("Error al eliminar el evento:", error);
      }
    });
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
