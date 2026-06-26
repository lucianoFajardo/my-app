"use server"
import { createClient } from "@/utils/supabase/server";

export async function deleteSpecificMonthAction(clientId: string, dateToRemove: string, planPrice: number) {
    try {
        const supabase = await createClient();
        const { data: payments, error: getErr } = await supabase
            .from("payments")
            .select("*")
            .eq("client_id", clientId);
        if (getErr || !payments) {
            throw new Error("No se encontraron pagos registrados: " + getErr?.message);
        }
        const getPayMap = payments.find(p => p.mouths_histoy_payment && p.payment_date && p.mouths_histoy_payment.includes(dateToRemove));
        if (!getPayMap) throw new Error("No se encontró un registro de pago que contenga la fecha especificada: " + dateToRemove);
        const updatedHistory = getPayMap.mouths_histoy_payment.filter(
            (date: string) => date !== dateToRemove
        );
        if (updatedHistory.length === 0) {
            const { error } = await supabase.from("payments").delete().eq("id_payments", getPayMap.id_payments);
            if (error) throw new Error("Error eliminando el pago completo: " + error.message);
        } else {
            const newAmountPay = Math.max(0, (getPayMap.amount_pay || 0) - planPrice);
            const newPaidUntilDate = updatedHistory.length > 0 ? updatedHistory[updatedHistory.length - 1] : null;
            const { error } = await supabase
                .from("payments")
                .update({
                    mouths_histoy_payment: updatedHistory,
                    months_paid_count: updatedHistory.length,
                    payment_date: newPaidUntilDate,
                    amount_pay: newAmountPay
                })
                .eq("id_payments", getPayMap.id_payments);
            if (error) throw new Error("Error actualizando el registro de pago: " + error.message);
        }
        return {
            success: true,
            message: `Mes eliminado correctamente del historial de pagos. Nuevo paid_until_date`,
            newPaidUntilDate: updatedHistory.length > 0 ? updatedHistory[updatedHistory.length - 1] : 0

        };

    } catch (error) {
        console.error("Error en deleteSpecificMonthAction:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}