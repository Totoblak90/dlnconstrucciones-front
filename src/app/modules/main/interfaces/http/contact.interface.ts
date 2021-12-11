import { Meta } from './batches.interface';
export interface Contact {
  email: string;
  comment: string;
}

export interface ContactFormRes {
  meta: Meta
  data: ContactFormResData
}

export interface ContactFormResData {
  email: string;
  comment: string;
  message: string;
};
