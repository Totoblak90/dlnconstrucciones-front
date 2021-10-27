export interface Meta {
  status: number;
}

export interface TypesOfJobs {
  meta: Meta;
  data: TypesOfJobsData[];
}

export interface TypesOfJobsData {
  id:         number;
  title:      string;
  image:      string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  url?:        string;
}

export interface Job {
  meta: Meta;
  data: JobBaseData;
}

export interface JobBaseData {
  id:           number;
  title:        string;
  image:        string;
  created_at:   Date;
  updated_at:   Date;
  deleted_at:   null;
  Jobs:        JobMoreInfo[];
}

export interface JobMoreInfo {
  id:           number;
  title:        string;
  image:        string;
  created_at:   Date;
  updated_at:   Date;
  deleted_at:   null;
  description: string;
  types_id:    number;
}
