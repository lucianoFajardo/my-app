'use server'

import { createClient } from "@/utils/supabase/server"
import type { PaymentSheetModel } from "@/app/dashboard/model/payment-sheet-model";

export const getPendingPaymentsAction = async () => {
    //* --> Fn para obtener de el view los pagos pendientes de los clientes, que se filtran por el estado moroso y se muestran en el dashboard.
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from('view_control_services_payment')
            .select('*')
            .eq('status_pay_client', 'MOROSO');
        if (error) {
            throw new Error("Error fetching pending payments: " + error.message);
        }
        return data as [];
    } catch (error) {
        throw new Error("Error fetching pending payments: " + error);
    }
}

export const getPaymentsSheetAction = async () => {
    //* --> Fn para obtener todos los datos de pago de los cliente y enviarlos a la hoja del excel
    try {
        const supabase = await createClient();
        const {data,error} = await supabase.from('payments').select('*,clients(name,lastname,phone1,phone2)');
        if (error) {
            throw new Error("Error fetching payments sheet: " + error.message);
        }
        return data as PaymentSheetModel[];
    } catch (error) {
        throw new Error("Error fetching payments sheet: " + error);
    }

}



//MOROSO