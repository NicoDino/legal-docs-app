export interface Categoria {
    _id: string;
    nombre: string;
    descendientes?: Categoria[];
    padre: Categoria;
}
