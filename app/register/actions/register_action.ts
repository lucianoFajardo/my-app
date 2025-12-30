"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
    const supabase = await createClient();
    const dataUser = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    let errorCatch = null;
    try {
        const { error , data } = await supabase.auth.signUp({
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
        console.log('signup:', dataUser);
        console.log('signup data:', data);
    } catch (e) {
        console.error('Error during signup:', e);
        errorCatch = e;
    }
    if (errorCatch) {
        console.error('Signup error:', errorCatch);
        redirect('/error')
    }
    revalidatePath('/login', 'layout')
    return redirect('/login')
}