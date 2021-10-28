export interface Services {
  meta: Meta;
  data: ServicesData[];
}

export interface ServicesData {
  id:          number;
  title:       string;
  image:       string;
  url:         string;
  created_at:  Date;
  updated_at:  Date;
  deleted_at:  Date | null;
}

export interface Meta {
  status: number;
}

export interface TipoServicio {
  meta: Meta;
  data: TipoServicioData;
}

export interface TipoServicioData {
  id:         number;
  title:      string;
  image:      string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  Pictures:   TipoServicioDataPictures[];
  Contents:   TipoServicioDataContent[];
}

export interface TipoServicioDataContent {
  id:            number;
  subtitle:      string;
  text:          string;
  created_at:    Date;
  updated_at:    Date;
  deleted_at:    Date | null;
  services_a_id: number;
}

export interface TipoServicioDataPictures {
  id: number;
  picture: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  services_b_id: number;
}

export interface Meta {
  status: number;
}
