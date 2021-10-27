export interface Services {
  meta: Meta;
  data: ServicesData[];
}

export interface ServicesData {
  id:          number;
  title:       string;
  description: null | string;
  image:       string;
  url:         string;
  created_at:  Date;
  updated_at:  Date;
  deleted_at:  Date | null;
}

export interface Meta {
  status: number;
}
