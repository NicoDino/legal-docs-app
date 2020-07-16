import { Documento } from './documento';

export interface Borrador {
  _id: string;
  emailCliente: string;
  documento: Partial<Documento>;
  campos: string[];
  createdAt: Date;
  pago: string;
  idPagoMP: string;
}
