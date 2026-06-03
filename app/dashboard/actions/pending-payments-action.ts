'use server'

import { createClient } from "@/utils/supabase/server"

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

//MOROSO