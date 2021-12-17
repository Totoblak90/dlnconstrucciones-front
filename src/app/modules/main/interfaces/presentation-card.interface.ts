export interface PresentationCard {
  titulo?: string;
  urlFoto: string;
  descripcion?: string;
  ruta?: string;
  sendDataByRoute?: boolean;
  urlData?: {data: any},
  openModal?: boolean;
  vendido?: string;
}
