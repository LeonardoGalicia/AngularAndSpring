import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {


  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear cliente";
  public errores: string[];
  public regiones: Region[];
  constructor(private clienteService: ClienteService,
    private router: Router, private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void{
    this.activatedRouter.params.subscribe(
      params => {
        let id=params['id'];
        if (id){
          this.clienteService.getCliente(id).subscribe( 
            cliente => {
              this.cliente = cliente;
            });
        }

      }
    );
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    });


  }

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      cliente =>{ 
        this.router.navigate(['/clientes']);
        swal.fire('Cliente guardado', `El cliente ${cliente.nombre} a sido creado!`, 'success');

      },
      err =>{
        this.errores=err.error.errors as string[];
      }
    );

  }

  public update(): void{
    this.clienteService.update(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente actualizado',`${response.mensaje} : ${response.cliente.nombre}`, 'success');
      },
      err => {
        this.errores=err.error.errors as string[];
      }
    )
  }

}
