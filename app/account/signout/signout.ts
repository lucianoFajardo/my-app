"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers";

export async function signOut() {
    // Lógica para cerrar sesión, como eliminar cookies o tokens
    const supabase = await createClient();
    try {
        const { error } = await supabase.auth.signOut();
        (await cookies()).delete("sb-access-token"); // Verificar si es necesario o no eliminar las cookies manualemtent
        (await cookies()).delete("sb-refresh-token");
        if (error) {
            throw error;
        }
    } catch (_) {
        throw new Error("Error al cerrar sesión");
    }
}