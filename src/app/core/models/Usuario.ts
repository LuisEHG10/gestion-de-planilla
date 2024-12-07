import { Rol } from "./Rol";

export interface Usuario{
  id_usuario:number,
  email:string,
  contrasenia:string,
  rol:Rol
}