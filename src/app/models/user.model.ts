import { environment } from 'src/environments/environment';
import { userRole } from '../modules/main/interfaces/http/auth.interface';

export class User {
  constructor(
    public nombre: string,
    public apellido: string,
    public email: string,
    public role: userRole,
    public avatar?: string,
    public phone?: string
  ) {}

  public getAvatar(): string {
    let imageUrl = '';
    this.avatar ? imageUrl = `${environment.API_IMAGE_URL}/${this.avatar}` : imageUrl = `assets/no-image.png`;
    return imageUrl;
  }
}
