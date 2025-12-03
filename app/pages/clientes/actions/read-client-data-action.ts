"use server"

import { createClient } from "@/utils/supabase/server";
import { ClienteModel, ClientPaymentInfo } from "../models/client-model";

export default async function readClientDataAction({ from, to }: { from: number; to: number }): Promise<ClienteModel[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('clients').select('*').range(from, to);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        throw new Error("Error al leer los datos del cliente", error as Error);
    }
}

//* Seleccionar data para crear las facturas de pago de un cliente, pero solamente llamar en esta API.
export const DataClientPaymentInfo = async ({ from, to }: { from: number; to: number }): Promise<ClientPaymentInfo[]> => {
    try {
        const supabase = await createClient();
        const { data: clients, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .range(from, to);

        if (clientError) {
            throw clientError;
        }

        const clientsWithPayments = await Promise.all(
            clients.map(async (client) => {
                const { data: payments, error: paymentError } = await supabase
                    .from('payments')
                    .select('months_paid')
                    .eq('client_id', client.id_client);

                if (paymentError) {
                    console.error(`Error fetching payments for client ${client.id_client}:`, paymentError);
                    // Return client with empty paidMonths array on error
                    return { ...client, paidMonths: [] };
                }

                const paidMonths = payments.map(p => p.months_paid);
                return { ...client, paidMonths };
            })
        );

        return clientsWithPayments as ClientPaymentInfo[];
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error selecting client data for payment info:", errorMessage);
        throw new Error(`Error al seleccionar los datos del cliente: ${errorMessage}`);
    }
}