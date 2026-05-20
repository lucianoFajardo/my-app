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
        const normalizedPlan = newClient.plan?.trim().toLowerCase() || "";
        let amountPlan = 0;
        if (normalizedPlan === '20.000' || normalizedPlan === '20.000') {
            amountPlan = 20000;
        } else if (normalizedPlan === '25.000' || normalizedPlan === '25.000') {
            amountPlan = 25000;
        }
        const { data: paymentData, error: paymentError } = await supabase
            .from('payments')
            .insert({
                client_id: newClient.id_client,
                status_payment: true,
                amount_pay: amountPlan,
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
    } catch (error) {
        return { success: false, error: "Ocurrió un error inesperado en el servidor." };
    }
}