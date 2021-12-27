import { userRole } from '../../main/interfaces/http/auth.interface';
import { Meta } from '../../main/interfaces/http/batches.interface';

export interface AllUsersRes {
  meta: Meta;
  data: FullUser[];
}

export interface FullUserRes {
  meta: Meta;
  data: FullUser;
}

export interface FullUser {
  avatar: string;
  created_at: string;
  deleted_at: string;
  dni?: number;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone?: string;
  Projects: Project[];
  role: userRole;
  updated_at: string;
}

export interface AllProjectsRes {
  meta: Meta;
  data: Project[];
}

export interface Project {
  balance: number;
  cashflow: any;
  created_at: string;
  deleted_at: null | string;
  id: number;
  Payments?: ProyectPayments[];
  title: string;
  total: number;
  updated_at: string;
  users_id: 1;
  Users?: FullUser;
}

export interface ProyectPayments {
  amount: number;
  created_at: string;
  datetime: string;
  deleted_at: string | null;
  id: number;
  projects_id: number;
  receipt: string;
  updated_at: string;
}
