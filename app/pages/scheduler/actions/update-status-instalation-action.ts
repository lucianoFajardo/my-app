'use server'

import { createClient } from "@/utils/supabase/server"

export default async function updateStatusInstalationAction(id: string) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('installations')
            .update({ status: 'completed' })
            .eq('id_instal', id)
            .select('*')
            .single();
        if (error) {
            console.error('Error al actualizar el estado de la instalación:', error);
            throw new Error('Error al actualizar el estado de la instalación');
        }
        console.log('Estatus de la instalación actualizado:', data)
        return data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error('Error al actualizar el estado de la instalación');
    }

}
