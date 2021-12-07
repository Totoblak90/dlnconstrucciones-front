import { Meta } from './batches.interface';

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
  data: LoginResData;
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
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  role: userRole;
  phone?: string;
  created_at: string;
  updeated_at: string;
  deleted_at?: string;
}

export type setUserProp =
  | 'nombre'
  | 'apellido'
  | 'email'
  | 'avatar'
  | 'role'
  | 'phone';

export type userRole = 'user' | 'admin';
