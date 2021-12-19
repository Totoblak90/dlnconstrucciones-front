export interface ZonasDeConstruccion {
  id: number;
  nombre: string
}

export interface CrearOEditarLoteReq {
  title: string;
  description: string;
  image: string;
  price: number;
  sold: boolean;
}
