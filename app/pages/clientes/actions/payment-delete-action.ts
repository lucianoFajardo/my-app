"use server"

import { createClient } from "@/utils/supabase/server";

export default async function deleteDialogPaymentAction(idPayment: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('payments').delete().eq('id_payments', idPayment);
        if (error) throw error;
        return data;
    } catch (error) {
        throw new Error("Error al eliminar el pago: " + error);
    }
}