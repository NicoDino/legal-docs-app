export interface Campo {
  _id: string;
  posicion: number;
  documento: string;
  identificador: string;
  nombre: string;
  descripcion: string;
  ayuda: string;
  tipo: string;
  opciones: any;
  opcionesSubdocumento: any;
  min: number;
  max: number;
}
