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
  avatar?: string;
  dni?: number;
  email: string;
  first_name: string;
  hash_id: string;
  id: number;
  last_name: string;
  phone?: string;
  Projects: Project[];
  role: userRole;
  validation?: string;
  created_at: string;
  deleted_at: string;
  updated_at: string;
}

export interface AllProjectsRes {
  meta: Meta;
  data: Project[];
}

export interface OneProjectRes {
  meta: Meta;
  data: Project;
}

export interface Project {
  Assets: ProyectAssets[];
  balance: number;
  cashflow: any;
  description: string;
  id: number;
  Payments?: ProyectPayments[];
  title: string;
  total: number;
  Users?: FullUser;
  users_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

export interface ProyectAssets {
  id: number;
  asset: string;
  type: 'image' | 'video';
  created_at: string;
  updated_at: string;
  deleted_at: null;
  projects_id: number;
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
  coin: string;
  cotizacionUsd: number;
  description: string;
  iva: boolean;
  wayToPay: string;
  subTotal: number;
  totalUsd: number;
}

export interface editUserRoleReq {
  role: 'admin' | 'user';
}

export type EditProyect = Omit<
  Project,
  'created_at' | 'updated_at' | 'deleted_at' | 'id'
>;
