export interface Jobs {
  meta: Meta;
  data: JobsData[];
}

export interface JobsData {
  id:          number;
  title:       null;
  description: null;
  image:       string;
  created_at:  Date;
  updated_at:  Date;
  deleted_at:  null;
  types_id:    number;
}

export interface Meta {
  status: number;
}
