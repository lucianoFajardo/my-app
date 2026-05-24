'use server';
import { createClient } from "@/utils/supabase/server";
export default async function totalAmountMonthsAction() {
    const supabase = await createClient();
    const today = new Date();
    const first_day = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const last_day = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();
    try {
        const { data, error } = await supabase.rpc('sum_purchases', { start_date: first_day, end_date: last_day }).single();
        if (error) {
            console.error("Error fetching total amount:", error);
            throw new Error("Error fetching total amount");
        }
        return data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error("Error al obtener el total de ingresos: ");
    }
}
