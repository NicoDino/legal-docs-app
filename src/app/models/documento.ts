import { Campo } from './campo';

export interface Documento {
  _id: string;
  nombre: string;
  html: string;
  tipo: string;
  nombresAlternativos: string[];
  categoria: string;
  referencias: string[];
  campos: Campo[];
  preview: string;
  precio: number;
  hojasDesde: number;
  hojasHasta: number;
  camposInsertados: number;
  padre: string,
  campoAsociado: string,
}
