import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  //la linea 10 y 11 son string, la 11 se indica implicitamente es una buena practica.
  title = 'Bienvenido a angular';
  curso: string = 'Curso Srping 5 con Angular';
  profesor: string = 'Andres';

}
