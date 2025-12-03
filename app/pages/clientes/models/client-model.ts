import { Payment } from "./payment-model"

export type ClienteModel = {
    readonly id_client: string
    name: string
    lastname: string
    antennaName: string
    sector: string
    paymentDate: string
    plan: string
    technicalName: string
    phone1: string
    phone2: string
    observations?: string
    paymentMethod: string
    latitude: string
    longitude: string
    discount?: number
    update_at?: Date
    range_payment: string
}

export type PaymentStatus = 'paid' | 'due' | 'overdue';

export interface DueMonth {
    name: string;
    date: string;
}

export type ClientPaymentInfo = {
    readonly id_client: string
    name: string
    lastname: string
    antennaName: string
    paymentDate: Date
    paid_until_date: string
    plan: string
    phone1: string
    phone2: string
    paidMonths: string[]
    created_at: Date
    planStatus: PaymentStatus
    monthsDue: DueMonth[]
    payments: Payment[]
}

