export type Payment = {
    id_payments: string;
    amount_pay?: number;
    payment_date: string;
    status_payment: boolean;
    months_paid?: string[];
};

export interface ViewStateClientPaymentInfoInterface {
    id_client: string;
    client: string;
    day_static_pay: string; // Las fechas desde Supabase llegan como string en formato ISO/YYYY-MM-DD
    covered_up_to: string;
    payment_range: string;
    // Usamos una unión de tipos para que TypeScript solo acepte estos tres textos exactos
    status_pay_client: 'AL DÍA' | 'PERIODO DE GRACIA' | 'MOROSO';
}