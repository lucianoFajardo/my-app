'use server'

import { createClient } from "@/utils/supabase/server";

export default async function showWithdrawalsDataAction({ from, to, search }: { from: number, to: number, search?: string }) {
    //* --> Traer los datos del cliente para poder mostrarlos en la tabla de los retiros
    const supabase = await createClient();
    try {
        try {
            let query = supabase.from('clients').select(
                'id_client, name, phone1, phone2, antenna_name , withdrawals(status)');
            if (search) {
                query = query.or(`name.ilike.%${search}%,antenna_name.ilike.%${search}%`);
            }
            const { data, error } = await query.range(from, to);
            if (error) {
                throw new Error("Error al obtener los datos de los retiros: " + error.message);
            }
            const formattedData = data.map((item) => ({
                id_client: item.id_client,
                name: item.name,
                phone1: item.phone1,
                phone2: item.phone2,
                antenna_name: item.antenna_name,
                status: item.withdrawals.some((withdrawal) => withdrawal.status === 'programado')
            }));
            return formattedData;
        } catch (error) {
            throw new Error("Error al obtener los datos de los retiros: " + error);
        }
    } catch (error) {
        throw new Error("Error al obtener los datos de los retiros: " + error);
    }
}