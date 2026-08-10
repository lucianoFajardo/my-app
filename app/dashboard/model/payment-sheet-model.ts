export interface PaymentSheetModel {
  id_payments: string;
  created_at: string;
  payment_date: string;
  amount_pay: string;
  months_paid_count: number;
  mouths_histoy_payment: Array<string>;
  clients: {
    name: string;
    lastname: string;
    phone1: string;
    phone2: string;
  };
}
