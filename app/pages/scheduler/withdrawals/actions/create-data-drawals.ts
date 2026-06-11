'use server'

import { createClient } from "@/utils/supabase/server"
import { DrawalsModel } from "../model/drawals-model";

export default async function createDataDrawalsAction(props: DrawalsModel) {
    const supabase = await createClient();
    try {
        //* --> Aqui llamar a supabase para crear el retiro programado
        const { data, error } = await supabase.from('withdrawals')
            .insert([props])
            .select()
            .single();
        if (error) {
            console.error("Error al crear el retiro programado: ", error);
            throw new Error("Error al crear el retiro programado: " + error.message);
        }
        return data;
    } catch (_) {
        throw new Error("Error al crear el retiro programado: " + _);
    }
}


