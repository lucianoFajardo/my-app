"use server"
import { createClient } from "@/utils/supabase/server";
import { ClienteModel } from "../models/client-model"

export const UpdateClientAction = async (client_id: string, updateDate: ClienteModel) => {
    try {
        //* --> crear logica para actualizar al cliente en la base de datos
        const supabase = await createClient();
        const {data , error}  = await supabase
            .from('clients')
            .update(updateDate)
            .eq('id_client', client_id);
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}