import { Meta } from './batches.interface';
import { Project } from '../../../admin-panel/interfaces/users.interface';

export interface LoginRes {
  meta: Meta;
  data: LoginResData;
}

export interface LoginResData {
  message: string;
  token: string;
  user: UserData;
}

export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRes {
  meta: Meta;
  data: RegisterResData;
}

export interface RegisterResData {
  message: string;
  user: UserData;
}

export interface RegisterForm {
  first_name: string;
  last_name: string;
  dni: number;
  email: string;
  password: string;
  passwordRepeat: string;
  terminosYCondiciones: boolean;
}

export interface UserData {
  avatar?: string;
  dni: number;
  email: string;
  first_name: string;
  hash_id: string;
  id: number;
  last_name: string;
  phone?: string;
  Projects?: Project[];
  role: userRole;
  validation?: string;
  created_at: string;
  updeated_at: string;
  deleted_at?: string;
}

export interface IdentifyTokenOActualizarUsuario {
  meta: Meta;
  data: UserData;
}

export interface ActualizarUsuarioReq {
  first_name: string;
  last_name: string;
  dni: number;
  email: string;
  phone?: number;
  password?: string;
  passwordRepeat?: string;
}

export type setUserProp =
  | 'nombre'
  | 'apellido'
  | 'email'
  | 'avatar'
  | 'role'
  | 'phone';

export type userRole = 'user' | 'admin' | 'master';
