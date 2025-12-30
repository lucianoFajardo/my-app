"use server"

import { createClient } from "@/utils/supabase/server";

export default async function deleteDialogPaymentAction(idPayment: string, clientId: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('payments').delete().eq('id_payments', idPayment);
        if (error) throw error;
        const { error: updateError } = await supabase.from('clients').update({
            paid_until_date: null,
        }).eq(
            'id_client', clientId
        );
        if (updateError) throw updateError;
        return data;
    } catch (error) {
        throw new Error("Error al eliminar el pago: " + (error as Error).message);
    }
}

// al eliminar tengo que tambien cambiar la fecha del paid_until_date en cliente para que quede como no pagado