'use server'

import { createClient } from "@/utils/supabase/server"

export default async function readInstalationAction() {
    const supabase = await createClient();
    const now = new Date();
    const firstDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    //* Feature: agregar para poder ver el mes en el que el usuario se encuentra o poder elegir el mes a consultar..!!
    try {
        const { data, error } = await supabase
            .from('installations')
            .select('*')
            .gte('date_instalation', firstDate)
            .lte('date_instalation', lastDate)
        if (error) {
            throw error
        }
        return data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error('Error al leer las instalaciones')
    }
}
