interface clients {
    name: string;
    latitude: string;
    longitude: string;
    phone1: string;
    phone2: string;
    antenna_name: string;
}

export interface pendingRepairDataModel {
    readonly id_repair: string;
    status: string;
    hour_repair: string;
    date_repair: string;
    clients?: clients;
}