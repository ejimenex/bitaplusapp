import { Component, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { endpoint } from "../../../../environments/environment";
import { Helpers } from "../../../helpers";
import { HttpClient } from "@angular/common/http";
import { AlertService } from "../../../core/_services/alert.service";
import { RoleService } from '../../../core/_services/role.service';
import { UserService } from "../../../core/_services/user.service";


declare var swal: any;

@Component({
  selector: "app-user-add",
  templateUrl: "./user-add.component.html",
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {
  @ViewChild('validateButton', {read: true, static: true }) validateButton: ElementRef;
  
  title: string
  showMessageNotFound: boolean;
  userRecomendation: any[];
  user: any={};
  roles=[]

  email: string
  nombre: string
  apellido: string  
  item: any
  codigo: string;
  departamento: string;
  posicion: string;
  oficina: string;  
  role: string = "#";
  status: Boolean;
  
  isClearBtnAvailable: Boolean = false;
  editStatus: Boolean = false;

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    protected _http: HttpClient,
    private userService: UserService,    
    private alertService: AlertService
  ) {
   
 
  }
  async ngOnInit(){
    
    this.title = this.item != 0
      ? "Editar Usuario"
      : "Agregar nuevo Usuario";
    
    await this.getAllRole();

    if (this.item != 0) {
      this.user = this.item;
      
      this.nombre       =  this.user.firstName;
      this.apellido     =  this.user.lastName;  
      this.email        =  this.user.userName;        
      this.email        =  this.user.address;       
      this.oficina      =  this.user.office;        
      this.departamento =  this.user.departament;   
      this.posicion     =  this.user.position;                   
      this.codigo       =  this.user.phoneNumber;  
      this.status       =  this.user.status;
      
      if(this.user.role != 'Sin asignar'){
        this.role         =  this.user.role;
      }
      this.editStatus = true;
      this.isClearBtnAvailable = true;
      
    } else {
      //this.user = null;
      this.userRecomendation = new Array();      
    }
    
  }
  save() {
    if(this.validate()) return   
    else this.add();
  }
  add() {    

    this.user.firstName = this.nombre;
    this.user.lastName = this.apellido;
    this.user.email = this.email;
    this.user.address = this.email;
    this.user.office = this.oficina;
    this.user.departament = this.departamento;
    this.user.position = this.posicion;
    this.user.role = this.role;
    this.user.phoneNumber = this.codigo;
    this.user.status = this.status;    

    if(this.user.id){
      this.userService.updateUser(this.user).subscribe(
        (response) => {
          this.alertService.success("Usuario actualizado exitosamente");
          this.notifyParent.emit();
          this.activeModal.close();
        },
        (error) => {
          
          let errorToShow = 'Ha ocurrido un error inesperado';
          
          if(typeof(error.error) == 'string'){
            errorToShow = error.error;
          }else if(typeof(error.error.detail) == 'string'){
            errorToShow = error.error.detail;
          } 

          errorToShow = errorToShow.length > 50 ? 'Ha ocurrido un error inesperado' : errorToShow;
          this.alertService.error(errorToShow);
        }
      );     
    }else {
    
      this.userService.createUser(this.user).subscribe(
        (response) => {
          this.alertService.success("Usuario creado exitosamente");
          this.notifyParent.emit();
          this.activeModal.close();
        },
        (error) => {          
          let errorToShow = 'Ha ocurrido un error inesperado';
          
          if(typeof(error.error) == 'string'){
            errorToShow = error.error;
          }else if(typeof(error.error.detail) == 'string'){
            errorToShow = error.error.detail;
          } 

          errorToShow = errorToShow.length > 100 ? 'Ha ocurrido un error inesperado' : errorToShow;
          this.alertService.error(errorToShow);
        }
      );
    }

  }
  validate(){
    if(!this.nombre){
      this.alertService.error('Por favor completar el campo de nombre')       
    }
    if(!this.apellido){
      this.alertService.error('Por favor completar el campo de apellido')       
    }
    if(!this.email){
      this.alertService.error('Por favor completar el campo de email')       
    }
    if(this.role == "#"){
      this.alertService.error('Por favor debe seleccionar un role de usuario')       
    }
    return !this.nombre || !this.apellido || !this.email || this.role == "#";
  }

  clearFields(){
    this.email = "";
    this.codigo = "";
    this.departamento = "";
    this.posicion = "";
    this.oficina = "";            
    this.apellido = "";
    this.nombre = "";
    this.editStatus = false;
    this.userRecomendation = [];
  }
  
  async validateUser(selected: string) {
    if(this.email === "") {
      this.clearFields();
    }
    if(selected) {
      this.email = selected;
    }

    this.userService
          .validateUser(this.email)
          .subscribe((res) => {             
            if(res.data.length > 0){
              this.userRecomendation = [];
              this.userRecomendation = res.data;
              this.showMessageNotFound = false;
              this.editStatus = false; 
              
              if(selected) {
                this.setData();
              }
              
            } else {
              this.editStatus = false;
              this.showMessageNotFound = true; 
            }
          });               
  }

  setData(){
    let res = this.userRecomendation;
    if(res.length == 1){
      this.codigo = res[0].codigo;
      this.departamento = res[0].departamento;
      this.posicion = res[0].cargoNombre;
      this.oficina = res[0].oficina;
      
      let nombres = res[0].nombre.split(' ');
      this.apellido = nombres.length > 3 ? nombres[2]+' '+nombres[3] : nombres[1]+' '+nombres[2];
      this.nombre = nombres.length > 3 ? nombres[0]+' '+nombres[1] : nombres[0];
  
      this.email = res[0].email;
      this.showMessageNotFound = false;
      this.editStatus = true;
    }
  }

  getAllRole() {
    this.userService.getRoles().subscribe(result => {
      this.roles = result;      
    });       
  }
}
