import { environment } from 'src/environments/environment';
import { userRole } from '../modules/main/interfaces/http/auth.interface';
import { Project } from '../modules/admin-panel/interfaces/users.interface';

export class User {
  constructor(
    public id: number,
    public nombre?: string,
    public apellido?: string,
    public email?: string,
    public role?: userRole,
    public dni?: number,
    public avatar?: string,
    public phone?: string,
    public projects?: Project[]
  ) {}

  public getAvatar(): string {
    let imageUrl = '';
    this.avatar ? imageUrl = `${environment.API_IMAGE_URL}/users/${this.avatar}` : imageUrl = `assets/no-image.png`;
    return imageUrl;
  }
}
