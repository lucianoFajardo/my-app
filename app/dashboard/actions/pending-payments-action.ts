'use server'

import { createClient } from "@/utils/supabase/server"

export const getPendingPaymentsAction = async () => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('view_control_service_payment').select('*').eq('status_pay_client', 'AL DÍA');
        if (error) {
            throw new Error("Error fetching pending payments: " + error.message);
        }
        return { success: true, data };
    } catch (error) {
        throw new Error("Error fetching pending payments: " + error);
    }



}