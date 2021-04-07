import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService, private activeRoute: ActivatedRoute,
    private modalService: ModalService ) { }

  ngOnInit(): void {
    
    this.activeRoute.paramMap.subscribe(param =>{
      let page: number = +param.get('page');
      page=(!page)? 0:page;
      this.clienteService.getClientes(page).subscribe(
        response =>{
          this.clientes = response.content;
          this.paginador = response;

        }
      )
    });

    this.modalService.notificarUpload.subscribe(cliente =>{
      this.clientes = this.clientes.map(clienteActual => {
        if(clienteActual.id == cliente.id){
          clienteActual.foto = cliente.foto;
        }
        return clienteActual;
      });
    });
    
  }

  delete(cliente: Cliente): void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `¿Está seguro que quiere eliminar al cliente ${cliente.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, elimnar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.delete(cliente.id).subscribe(
          response => {
            console.log(this.clientes)
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            console.log(this.clientes)
            swalWithBootstrapButtons.fire(
              'Cliente eliminado',
              'Cliente eliminado con éxito!',
              'success'
            )

          }
        )

        
      }
    })

  }
  
  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    console.log(cliente);
    this.modalService.abrirModal();
  }

}
