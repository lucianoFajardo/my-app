'use server'

import { createClient } from "@/utils/supabase/server";

export default async function updateStatusDrawalsAction(props: string) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('withdrawals').update({ status: 'completado' }).eq('id_withdrawal', props)
        if (error) {
            throw new Error('Error al actualizar el estado del retiro: ' + error.message);
        }
        return data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error('Error en el servidor al actualizar el estado del retiro',)
    }
}

