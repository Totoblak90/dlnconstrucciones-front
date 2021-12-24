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
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  role: userRole;
  phone?: string;
  dni?: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  Projects: Project[];
}

export interface Project {
  id: number;
  balance: number;
  cronoflow: any;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  users_id: 1;
}
