'use server'

import { createClient } from "@/utils/supabase/server";

export default async function deleteDataDrawalsAction(props: string) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('withdrawals').delete().eq('id_withdrawal', props).single();
        if (error) {
            throw new Error('Error al eliminar el retiro programado')
        }
        return data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error('Error en el servidor al eliminar el retiro programado')
    }

}
