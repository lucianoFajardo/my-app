export interface ClientResultRepairModel {
    id_client: string;
    name: string;
    lastname: string;
    antennaName: string;
    latitude?: string;
    longitude?: string;
    phone1?: string;
    phone2?: string;
}

export interface RepairFormModel {
    client_Key: string;
    date_repair: Date;
    status?: string;
    hour_repair: string;
    notes: string;
}