export interface PostalZones {
  meta: Meta;
  data: PostalZonesData[];
}

export interface PostalZonesData {
  id: number;
  title: string;
  image: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  url?: string;
}

export interface Meta {
  status: number;
}

export interface Lotes {
  meta: Meta;
  data: LotesData;
}

export interface LotesData {
  id: number;
  title: string;
  image: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  Batches: Batch[];
}

export interface Batch {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number | null;
  sold: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  categories_id: number;
  url?: string;
}

export interface BatchComplete {
  meta: Meta;
  data: Batch
}
