export interface Campo {
  _id: string;
  posicion: number;
  documento: string;
  identificador: string;
  descripcion: string;
  ayuda: string;
  tipo: string;
  opciones: any;
  min: number;
  max: number;
}
