export interface ClientResultRepairModel {
    readonly id_client: string;
    name: string;
    lastname: string;
    antenna_name: string;
    latitude?: string;
    longitude?: string;
    phone1?: string;
    phone2?: string;
}

export interface RepairFormModel {
    client_key: string;
    date_repair: Date;
    status?: string;
    hour_repair: string;
    notes: string;
}