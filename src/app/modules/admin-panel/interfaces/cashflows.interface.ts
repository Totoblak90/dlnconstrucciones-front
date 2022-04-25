import { Meta } from '../../main/interfaces/http/batches.interface';

export interface Cashflow {
  id: number;
  cashflow: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  projects_id: number;
}

export interface CreateCashflowRes {
  meta: Meta;
  data: CreateCashflowResData[];
}

export interface CreateCashflowResData {
  id: number;
  projects_id: string;
  cashflow: string;
  updated_at: string;
  created_at: string;
}
