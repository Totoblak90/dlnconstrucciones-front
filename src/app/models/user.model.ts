import { environment } from 'src/environments/environment';
import { userRole } from '../modules/main/interfaces/http/auth.interface';
import { Project } from '../modules/admin-panel/interfaces/users.interface';

// export class User {
//   constructor(
//     public id: number,
//     public nombre: string,
//     public apellido: string,
//     public email: string,
//     public role: userRole,
//     public dni?: number,
//     public avatar?: string,
//     public phone?: string,
//     public projects?: Project[]
//   ) {}


// }

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
