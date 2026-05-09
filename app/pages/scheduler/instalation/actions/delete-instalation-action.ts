'use server'

import { createClient } from "@/utils/supabase/server";
import { CalendarModelDataInstal } from "../models/calendar-instal-model"

export default async function deleteInstallationAction(value: CalendarModelDataInstal) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('installations').delete().eq('id_instal', value.id_instal);
        if (error) {
            throw new Error('Error al eliminar la instalacion');
        }
        return data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error('Error al eliminar la instalacion')
    }
}