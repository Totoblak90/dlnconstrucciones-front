export interface CuerpoTabla {
  id: number;
  imagen?: string;
  item2?: string;
  item3?: string;
  item4?: string;
  linkVerMas?: LinkVerMas;
  item6?: string;
  item7?: string;
  item8?: string;
  item9?: string;
  item10?: string;
  tipoDeArchivo?: string;
}

export interface LinkVerMas {
  value: number;
  route: string;
}
