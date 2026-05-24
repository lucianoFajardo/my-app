"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate"
import { redirect } from "next/navigation"

export async function signup(dataUser: { email: string, password: string }) {
    const supabase = await createClient();
    try {
        let errorCatch = null;
        try {
            const { error, data } = await supabase.auth.signUp({
                email: dataUser.email,
                password: dataUser.password,
                // options: {
                //     data: {
                //         // agregar campos personalizados al perfil del usuario con su metadata
                //         first_name: dataUser.first_name,
                //         last_name: dataUser.last_name,
                //     }
                // }
            });
            errorCatch = error;
            if (error) {
                console.error('Error al registrarte:', error);
                return { error: error.message }
            }
            return { success: "Usuario registrado exitosamente. Por favor, verifica tu correo para activar tu cuenta." }
        } catch (e) {
            console.error('Error al momento de registrarte', e);
            errorCatch = e;
        }
        if (errorCatch) {
            console.error('Signup error:', errorCatch);
            redirect('/error')
        }
        revalidatePath('/login', 'layout')
        return redirect('/login')
    } catch (error) {
        throw error
    }
}