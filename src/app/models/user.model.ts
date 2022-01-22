import { userRole } from '../modules/main/interfaces/http/auth.interface';
import { Project } from '../modules/admin-panel/interfaces/users.interface';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: userRole;
  dni?: number;
  avatar?: string;
  phone?: string;
  projects?: Project[];
}
