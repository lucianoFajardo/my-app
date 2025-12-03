"use server"

import { createClient } from "@/utils/supabase/server"

export async function supabaseConnectionAction() {
    const supabase = await createClient();
    return supabase;
}

// TODO: ya esta conectado el supabase para poder empezar a cargar datos desde aqui