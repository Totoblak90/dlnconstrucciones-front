export interface ProjectPaymentsReq {
  projects_id: number;
  amount: number;
  receipt: string;
  datetime: string;
}
