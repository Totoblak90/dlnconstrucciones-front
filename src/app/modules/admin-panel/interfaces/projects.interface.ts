import { Meta } from '../../main/interfaces/http/batches.interface';

export interface CreateOrEditProyectReq {
  user: number;
  coin: string;
  total: number;
  title: string;
  description: string;
}

export interface CreateProyectRes {
  meta: Meta;
  data: CreateProyectResData;
}

export interface CreateProyectResData {
  id: number;
  users_id: string;
  title: string;
  description: string;
  coin: string;
  total: number;
  balance: number;
  updated_at: string;
  created_at: string;
}

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
