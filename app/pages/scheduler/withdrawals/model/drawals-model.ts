//* --> Interfaz para el modelo de la vista de datos en las tablas de los retiros programados.
export interface DrawalsClientModel {
    readonly id_client: string;
    name: string;
    phone1: string;
    phone2: string;
    antenna_name: string;
    status?: boolean;
}

//* --> Interfaz para crear el modelo de los retiros programados. el desplegable
export interface DrawalsModel {
    day_withdrawal: string;
    reason: string;
    hour_withdrawal: string;
    id_client: string;
    observations: string;
    status: 'programado' | 'completado' | 'cancelado';
}