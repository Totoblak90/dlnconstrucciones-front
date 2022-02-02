export interface ProjectPaymentsReq {
  projects_id: number;
  amount: number;
  receipt: string;
  datetime: string;
  description: string;
  wayToPay: string;
  coin: string;
  iva: boolean;
  cotizacionUsd?: number;
}

export interface Galeria {
  base64: string;
  project_id: number;
  type: string;
  asset_id: number;
}
