export type Payment = {
    id_payments: string;
    amount_pay?: number;
    payment_date: string;
    status_payment: boolean;
    months_paid?:  string[];
};