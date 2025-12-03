"use server"

import { createClient } from "@/utils/supabase/server";

export const deleteClientAction = async (clientId: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('clients').delete().eq('id_client', clientId);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        throw new Error("Error al eliminar el cliente", error as Error);
    }
}