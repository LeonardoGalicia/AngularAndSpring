import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string='http://localhost:8888/api/clientes';
  private httpHeaders= new HttpHeaders({'content-Type':'application/json'});

  constructor(private http: HttpClient, private router: Router) { }


  getRegiones():Observable<any>{
    return this.http.get(`${this.urlEndPoint}/regiones`);
  }

  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(`${this.urlEndPoint}/page/${page}`).pipe(
      map( (response:any) => {
        (response.content).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.createAt = formatDate(cliente.createAt,'EEEE dd, MMMM yyyy','es-MX');
          return cliente;
        });
        return response;
      })
    );

  }

  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente,{headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente), //esto es lo mismo que en update pero utilizando map para retornar tipo Cliente 
      catchError(e =>{
        if(e.status==400){
          return throwError(e);
        }
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error,'error');
        return throwError;
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje,'error');
        return throwError(e);

      })
    );

  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }

}
