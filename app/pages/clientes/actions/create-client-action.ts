"use server"

import { createClient } from "@/utils/supabase/server";
import { ClienteModel } from "../models/client-model"

export async function createClientNetworkAction(promp: ClienteModel) {
    const supabase = await createClient();
    try {
        const { data: newClient, error: clientError } = await supabase
            .from("clients")
            .insert(promp)
            .select()
            .single();
        if (clientError) {
            return { success: false, error: "No se pudo registrar el cliente" };
        }
        const { data: paymentData, error: paymentError } = await supabase
            .from('payments')
            .insert({
                client_id: newClient.id_client,
                status_payment: true,
                amount_pay: newClient.plan.toLocaleString('es-CL'),
                payment_date: newClient.initial_payment || new Date().toISOString(),
                months_paid_count: 1
            })
            .select()
            .single();
        if (paymentError) {
            return {
                success: false,
                error: "Cliente guardado, pero falló el registro del pago",
                data: newClient
            };
        }
        return {
            success: true,
            data: {
                client: newClient,
                payment: paymentData
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        return { success: false, error: "Ocurrió un error inesperado en el servidor." };
    }
}