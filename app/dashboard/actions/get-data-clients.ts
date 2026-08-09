'use server'

import { createClient } from "@/utils/supabase/server";
import { ClienteModel } from "@/app/pages/clientes/models/client-model";
export default async function getDataClientSheet(): Promise<ClienteModel[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('clients').select('*');
        if (error) {
            throw error;
        }
        return data as ClienteModel[];
    } catch (error) {
        throw new Error("Error al leer los datos del cliente: " + (error as Error).message);
    }
}