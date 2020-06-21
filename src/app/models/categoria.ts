export interface Categoria {
    _id: string;
    nombre: string;
    tipo: string;
    descendientes?: Categoria[];
    padre: Categoria;
}
