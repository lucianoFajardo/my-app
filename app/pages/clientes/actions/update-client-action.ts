"use server"

import { createClient } from "@/utils/supabase/server";
import { ClienteModel } from "../models/client-model"

export const UpdateClientAction = async (clientId: string, updateDate: ClienteModel) => {
    try {
        // crear logica para actualizar al cliente en la base de datos
        console.log("Updating client:", clientId, updateDate);
        const supabase = await createClient();
        const { data, error } = await supabase.from('clients').update(updateDate).eq('id_client', clientId);
        if (error) {
            console.error("Error updating client:", error);
            throw error;
        }
        console.log("Client updated successfully:", data);
        return data;
    } catch (error) {
        console.error("Error updating client:", error);
    }
}