import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, Limit, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { GroupFeedComponent } from '../group-feed/group-feed.component';



@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [NgFor, CommonModule,
    FormsModule, GroupFeedComponent],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})
export class GruposComponent {
  searchTerm: string = '';
  groups: Grupo[] = []; // Lista de grupos
  showCreateGroupModal: boolean = false;
  auth: FirebaseTSAuth = new FirebaseTSAuth();
  firestore : FirebaseTSFirestore = new FirebaseTSFirestore();
  selectedGroup: Grupo | null = null; // Grupo actualmente seleccionado


  newGroup: Partial<Grupo> = {
    nombre: '',
    descripcion: '',
    miembros: [],
    creador: ''
  };

constructor(){
  
}

ngOnInit() {
  this.listGroups();
  
}

viewGroupFeed(group: Grupo) {
  //console.log("Grupo seleccionado antes de asignar:", group); // Debugging
  this.selectedGroup = group; // Asigna el grupo seleccionado
  //console.log("selectedGroup después de asignar:", this.selectedGroup); // Debugging
}


backToGroups() {
  this.selectedGroup = null; // Limpia el grupo seleccionado para mostrar la lista
}


listGroups() {
  this.firestore.getCollection({
    path: ["grupos"],
    where: [
      new OrderBy("nombre", "asc"),
    ],
    onComplete: (result) => {
      this.groups = []; // Vaciar la lista antes de llenarla
      result.docs.forEach((doc) => {
        const group = doc.data(); // Obtén los datos del documento
        group['id'] = doc.id; // Asigna el ID del documento al grupo
        this.groups.push(group as Grupo); // Asegúrate de que group se ajuste a la interfaz Grupo
      });
    },
    onFail: (err) => {
      console.error("Error al obtener los grupos:", err);
    },
  });
}



filteredGroups() {
  return this.groups.filter(group => 
    (group.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '') ||
    (group.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '')
  );
}

openCreateGroupModal() {
  this.showCreateGroupModal = true;
}
// Cerrar modal de creación de grupo
closeCreateGroupModal() {
  this.showCreateGroupModal = false;
  this.newGroup = { nombre: '', descripcion: '', miembros: [], creador: '' };
}

createGroup() {
  const userId = this.auth.getAuth().currentUser?.uid;
  if (!userId) {
    alert('Debes iniciar sesión para crear un grupo.');
    return;
  }

  if (!this.newGroup.nombre || !this.newGroup.descripcion) {
    alert('El nombre y la descripción del grupo son obligatorios.');
    return;
  }

  const group: Grupo = {
    id: '',
    nombre: this.newGroup.nombre,
    descripcion: this.newGroup.descripcion,
    miembros: [userId],
    creador: userId
  };

  this.firestore.create({
    path: ["grupos"],
    data: group,
    onComplete: (docId) => {
      alert(`Grupo creado con éxito. ID: ${docId}`);
      this.closeCreateGroupModal();
      this.listGroups();
    },
    onFail: (error) => {
      console.error("Error al crear el grupo:", error);
    }
  });
}
joinGroup(groupId: string | undefined) {
  if (!groupId) {
    console.error("El ID del grupo es inválido o está vacío.");
    alert("Ocurrió un error al intentar unirte al grupo.");
    return;
  }

  const userId = this.auth.getAuth().currentUser?.uid;
  if (!userId) {
    alert("Debes iniciar sesión para unirte a un grupo.");
    return;
  }

  this.firestore.getDocument({
    path: ["grupos", groupId],
    onComplete: (result) => {
      const group = result.data();
      if (group) {
        const miembros = Array.isArray(group['miembros']) ? group['miembros'] : [];
        if (!miembros.includes(userId)) {
          miembros.push(userId);
          this.firestore.update({
            path: ["grupos", groupId],
            data: { miembros },
            onComplete: () => {
              alert("Te has unido al grupo con éxito.");
              this.listGroups();
            },
            onFail: (error) => {
              console.error("Error al actualizar los miembros del grupo:", error);
            }
          });
        } else {
          alert("Ya eres miembro de este grupo.");
        }
      } else {
        console.error("El grupo no existe.");
      }
    },
    onFail: (error) => {
      console.error("Error al obtener el grupo:", error);
    }
  });
}

isMember(group: Grupo): boolean {
  const userId = this.auth.getAuth().currentUser?.uid;
  return group.miembros.includes(userId || '');
}











}

export interface Grupo {
  id: string;
  nombre: string;
  descripcion: string;
  miembros: string[];
  creador: string;
}

