"use server"

import { createClient } from "@/utils/supabase/server";

export const deleteClientAction = async (clientId: string) => {
    try {
        const supabase = await createClient();
        const { data: deletedPayments, error: deletePaymentsError } = await supabase.from('payments').delete().eq('client_id', clientId).select();
        if (deletePaymentsError) {
            console.error("Error al eliminar los pagos del cliente:", deletePaymentsError);
            throw new Error (deletePaymentsError.message);
        }
        const { data, error } = await supabase.from('clients').delete().eq('id_client', clientId);
        if (error) {
            console.error("Error al eliminar el cliente:", error);
            throw new Error (error.message);
        }
        return data;
    } catch (error) {
        throw new Error("Error al eliminar el cliente", error as Error);
    }
}