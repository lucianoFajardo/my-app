"use server"
import { createClient } from "@/utils/supabase/server";
import { Payment } from "../models/payment-model";

export async function readPaymentsAction(idClient: string) {
    // Lógica para leer los pagos del cliente
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('payments').select('*').eq('client_id', idClient);
        if (error) {
            throw error;
        }
        return data as Payment[];
    } catch (error) {
        throw new Error("Error al leer los pagos del cliente", error as Error);
    }
}