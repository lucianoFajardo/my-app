"use server"
import { createClient } from "@/utils/supabase/server";
import { ClientPaymentInfo } from "../models/client-model";

export async function paymentDataClientAction(
    props: ClientPaymentInfo,
    dateToPay: string[],
    payedPlanAmount?: number,
) {
    //* --> Lógica para procesar el pago del cliente
    try {
        const supabase = await createClient();
        //* --> Creamos el baucher de pago en la tabla payments
        const { data, error } = await supabase.from("payments").insert({
            payment_date: new Date(),
            client_id: props.id_client,
            status_payment: true,
            months_paid_count: dateToPay.length, //* --> Guardamos la cantidad de meses pagados
            mouths_histoy_payment: dateToPay,
            amount_pay: payedPlanAmount
        });
        if (error) throw new Error("Error al insertar el pago" + (error as Error).message);
        return { success: true, data }
    } catch (error) {
        throw new Error("Error al procesar el pago del cliente" + (error as Error).message);
    }
}