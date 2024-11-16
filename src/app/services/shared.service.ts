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

  //senID
  private idSource = new BehaviorSubject<string | null>(null); // Usa BehaviorSubject para emitir y almacenar el último valor
  currentId$: Observable<string | null> = this.idSource.asObservable();

  // Método para actualizar el valor del ID
  sendId(id: string) {
    this.idSource.next(id);
  }
}
