"use server";

import { createClient } from '@/utils/supabase/server';

export async function getDataUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    // si el usuario no esta autenticado o no existe, lanzar el error.
    if (!user) {
        throw new Error('usuario no autenticado.');
    }
    const { data, error } = await supabase.from('profiles').select('user_id , full_name').eq('user_id', user.id).single();
    if (error) {
        throw new Error(error.message);
    }
    return {
        data
    }
}                       

// Agregar un try catch para mejorar y manejar errores que se puedan presentar