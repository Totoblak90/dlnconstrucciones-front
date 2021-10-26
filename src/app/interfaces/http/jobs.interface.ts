export interface Jobs {
  meta: Meta;
  data: JobsData[];
}

export interface JobsData {
  id?:          number;
  title:        string;
  description?: string;
  image:        string;
  url?:         string;
  created_at?:  Date;
  updated_at?:  Date;
  deleted_at?:  Date;
  types_id?:    number;
}

export interface Meta {
  status: number;
}
