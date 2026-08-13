import { Payment } from "./payment-model"

export type ClienteModel = {
    readonly id_client: string
    created_at: string; // timestamp with time zone
    name: string;
    lastname: string;
    antenna_name: string;
    sector: string;
    initial_payment: string; // date (Primer pago)
    plan: number;
    technical_name: string;
    phone1: string;
    phone2: string;
    observations: string;
    payment_method: string;
    latitude: string;
    longitude: string;
    discount: number; // smallint
    range_payment: string; // Rango de fecha de pago
    paid_until_date: string; // date (Pagado hasta)
    grace_days: number; // integer (Días de gracia)
};

export type PaymentStatus = 'paid' | 'due' | 'overdue';

export interface DueMonth {
    name: string;
    date: string;
}

// ->> TODO : modificar esta tabla tambien por que tambien se modificaron unos campos en la tabla
export type ClientPaymentInfo = {
    readonly id_client: string
    name: string
    lastname: string
    antenna_name: string
    initial_payment: string; // date (Primer pago)
    paid_until_date: string
    plan: number
    phone1: string
    phone2: string
    paidMonths: string[]
    created_at: Date
    planStatus: PaymentStatus
    monthsDue: DueMonth[]
    payments: Payment[]
    range_payment: string
}

export type DetailedStatus = {
    status: 'paid' | 'grace_period' | 'due' | 'upcoming';
    message: string;
    daysRemaining?: number; // Días restantes en el período de gracia
};

