export interface Documento {
    _id: string;
    nombre: string;
    html: string;
    tipo: string;
    nombresAlternativos: string[];
    categoria: string;
    referencias: string[];
    campos: string[];
    preview: string;
    precio: number;
}
