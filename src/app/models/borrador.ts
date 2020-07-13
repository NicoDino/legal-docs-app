import { Documento } from './documento';

export interface Borrador {
  _id: string;
  emailCliente: string;
  documento: string;
  campos: string[];
  createdAt: Date;
}
