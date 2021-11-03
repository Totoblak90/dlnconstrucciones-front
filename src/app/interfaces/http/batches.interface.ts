export interface PostalZones {
  meta: Meta;
  data: PostalZonesData[];
}

export interface PostalZonesData {
  id:         number;
  title:      string;
  image:      string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}

export interface Meta {
  status: number;
}
