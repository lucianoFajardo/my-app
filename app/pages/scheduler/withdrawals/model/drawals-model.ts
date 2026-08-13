//* --> Interfaz para el modelo de la vista de datos en las tablas de los retiros programados.
export interface DrawalsClientModel {
    readonly id_client: string;
    name: string;
    lastname: string;
    phone1: string;
    phone2: string;
    antenna_name: string;
    status?: boolean;
    day_withdrawal?: Date;
    hour_withdrawal?: string;
    reason?: string;
    observations?: string;
}

//* --> Interfaz para crear el modelo de los retiros programados. el desplegable
export interface DrawalsModel {
    readonly id_withdrawal: string;
    day_withdrawal: string;
    reason: string;
    hour_withdrawal: string;
    id_client: string;
    observations: string;
    status: 'programado' | 'completado' | 'cancelado' | 'activo';
}

export interface DrawalsViewData {
    readonly id_withdrawal: string;
    name: string;
    lastname: string;
    phone1: string;
    phone2?: string;
    antenna_name: string;
    day_withdrawal: string;
    hour_withdrawal: string;
    reason: string;
    observations?: string;
    status: 'programado' | 'completado' | 'cancelado' | 'activo';
}