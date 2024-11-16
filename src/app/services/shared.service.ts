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
  

  //senID
  private idSource = new BehaviorSubject<string | null>(null); // Usa BehaviorSubject para emitir y almacenar el último valor
  currentId$: Observable<string | null> = this.idSource.asObservable();

  // Método para actualizar el valor del ID
  sendId(id: string) {
    this.idSource.next(id);
  }
}
