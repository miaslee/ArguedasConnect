import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  

//perfilclick en appcomponetn
  private perfilClickSource = new Subject<void>();
  perfilClick$ = this.perfilClickSource.asObservable();

  triggerPerfilClick() {
    this.perfilClickSource.next();
  }

  //Miperfilclick en appcomponetn
  private perfilClickSource1= new Subject<void>();
  perfilClick1$ = this.perfilClickSource1.asObservable();

  triggerPerfilClick1() {
    this.perfilClickSource1.next();
    
  }

  //Miperfilclick en appcomponetn
  private perfilClickSource2= new Subject<void>();
  perfilClick2$ = this.perfilClickSource2.asObservable();

  triggerPerfilClick2() {
    this.perfilClickSource2.next();
    
  }
  //Loadposts grupo
  private perfilClickSource3= new Subject<void>();
  perfilClick3$ = this.perfilClickSource3.asObservable();

  triggerPerfilClick3() {
    this.perfilClickSource3.next();
    
  }
  //Loadposts feedd
  private perfilClickSource4= new Subject<void>();
  perfilClick4$ = this.perfilClickSource4.asObservable();

  triggerPerfilClick4() {
    this.perfilClickSource4.next();
    
  }
  

  //senID
  private idSource = new BehaviorSubject<string | null>(null); // Usa BehaviorSubject para emitir y almacenar el último valor
  currentId$: Observable<string | null> = this.idSource.asObservable();

  // Método para actualizar el valor del ID
  sendId(id: string) {
    this.idSource.next(id);
  }
  //notificaciones
  //senID
  private idSource1 = new BehaviorSubject<string | null>(null); // Usa BehaviorSubject para emitir y almacenar el último valor
  currentId1$: Observable<string | null> = this.idSource1.asObservable();

  // Método para actualizar el valor del ID
  sendId1(id: string) {
    this.idSource1.next(id);
    
  }
}
