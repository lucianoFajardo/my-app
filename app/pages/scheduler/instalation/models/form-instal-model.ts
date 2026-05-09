// Enum para manejar el estado de la instalacion
enum statusModel {
    pending = 'pending',
    completed = 'completed',
    canceled = 'canceled'
}

// Modelo para poder manejar los datos del formulario de la instalacion 
export type FormInstalModel = {
    id_instal: string
    name_client: string
    address: string
    phone1: string
    phone2: string
    gps_coords: string
    date_instalation: string
    hour_instalation: string
    status?: statusModel
    notes_instalation: string
}

export const hours_array =
    [9, 10, 11, 12, 15, 16, 17, 18]
