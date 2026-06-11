'use server'

import { createClient } from "@/utils/supabase/server";

export default async function showDataDrawalsAction({ from, to, search }: { from: number, to: number, search?: string }) {
    //* --> Traer los datos del cliente para poder mostrarlos en la tabla de los retiros
    const supabase = await createClient();
    try {
        let query = supabase.from('withdrawals').select('* , clients (id_client, name, phone1, phone2, antenna_name)');
        if (search) {
            query = query.or(`name.ilike.%${search}%,antenna_name.ilike.%${search}%`);
        }
        const { data, error } = await query.range(from, to);
        if (error) {
            throw new Error("Error al obtener los datos de los retiros: " + error.message);
        }
        //* --> Formatear la data para que se ajuste a la interfaz que e modelado
        const formattedData = data.map((withdrawal) => ({
            id_withdrawal: withdrawal.id_withdrawal,
            id_client: withdrawal.clients.id_client,
            name: withdrawal.clients.name,
            phone1: withdrawal.clients.phone1,
            phone2: withdrawal.clients.phone2,
            antenna_name: withdrawal.clients.antenna_name,
            day_withdrawal: withdrawal.day_withdrawal,
            hour_withdrawal: withdrawal.hour_withdrawal,
            reason: withdrawal.reason,
            observations: withdrawal.observations,
            status: withdrawal.status,
        })) || [];
        return formattedData;
    } catch (error) {
        throw new Error("Error al obtener los datos de los retiros: " + error);
    }
}