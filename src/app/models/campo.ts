export interface Campo {
  _id: string;
  documento: string;
  identificador: string;
  descripcion: string;
  ayuda: string;
  tipo: string;
  opciones: any;
  min: number;
  max: number;
}
