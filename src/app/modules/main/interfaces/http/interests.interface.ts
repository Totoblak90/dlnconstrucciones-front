export interface Interests {
  meta: Meta;
  data: InterestsData[];
}

export interface InterestsData {
  id:          number;
  title:       string;
  description: string;
  image:       string;
  created_at:  Date;
  updated_at:  Date;
  deleted_at:  Date | null;
}

export interface Meta {
  status: number;
}
