"use server"

import { createClient } from "@/utils/supabase/server";
import { ClientPaymentInfo } from "../models/client-model";

// TODO: ajustar los parámetros según lo que necesites para el pago de los clientes el total y podr mostrar los meses que pago el cliente
export async function paymentDataClientAction(
    props: ClientPaymentInfo,
    dateToPay: string[],
    newPaidUntilDate?: string,
    payedPlanAmount?: number,
) {
    // Lógica para procesar el pago del cliente
    try {
        const supabase = await createClient();
        // creamos el baucher de pago en la tabla payments
        const { error } = await supabase.from("payments").insert({
            payment_date: new Date(),
            client_id: props.id_client,
            status_payment: true,
            months_paid: dateToPay,
            amount_pay: payedPlanAmount
        });
        if (error) throw new Error("Error al insertar el pago" + (error as Error).message);

        // actualizamos la fecha hasta la que está pagado el cliente en la tabla clients
        const { error: updateError } = await supabase.from('clients').update({
            paid_until_date: newPaidUntilDate
        }).eq('id_client', props.id_client);
        if (updateError) throw updateError;

        return newPaidUntilDate; // devolver las fechas pagadas
    } catch (error) {
        throw new Error("Error al procesar el pago del cliente" + (error as Error).message);
    }
}

// //  if (data) {
//             // Actualizar la fecha de pago del cliente en la tabla 'clients'
//             const newPaymentDate = new Date(props.paymentDate);
//             newPaymentDate.setMonth(newPaymentDate.getMonth() + 1); // Avanzar un mes
//             const { error } = await supabase.from('clients').upsert({
//                 id_client: props.id_client,
//                 paymentDate: newPaymentDate.toISOString().split('T')[0]
//             })
//             if (error) throw error;
//         }
//         // return data;