type InstallationStatus = 'pending' | 'completed' | 'canceled'

export type CalendarModelDataInstal = {
    id_instal: string
    name_client: string
    date_instalation: string
    phone1: string
    phone2: string
    hour_instalation: string
    address: string
    status: InstallationStatus
}

export const weekDays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']
