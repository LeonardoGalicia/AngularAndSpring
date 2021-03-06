import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso: number = 0

  constructor(private clienteService: ClienteService, private activateRoute: ActivatedRoute,
    public modalService: ModalService) { }

  ngOnInit(): void {
  }

  seleccionarFoto(event){

    console.log("foto seleccionada");
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error','El archivo debe ser de tipo imagen','error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('Error','Debe seleccionar una foto','error');

    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada,this.cliente.id).subscribe(event => {

        if(event.type === HttpEventType.UploadProgress){

          this.progreso = Math.round((event.loaded/event.total)*100);

        }else if(event.type === HttpEventType.Response){

          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire('La foto se ha subido', response.mensaje , 'success');

        }
      });
    }
    
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
