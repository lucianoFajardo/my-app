"use server";

import { createClient } from '@/utils/supabase/server';

export async function getDataUser() {
    const supabase = await createClient();
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('usuario no autenticado.');
        }
        const { data, error } = await supabase
            .from('profiles')
            .select('user_id , full_name')
            .eq('user_id', user.id)
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return {
            data
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error('Error al obtener los datos del usuario')
    }
}