"use server";

import { createClient } from "@/utils/supabase/server";
import { AccountModel } from "../model/account-model";

export async function updateAccountAction(formData: AccountModel) {
    // Lógica para actualizar la cuenta del usuario
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Usuario no autenticado.');
    }
    const updateDataAccount = await supabase.auth.updateUser({
        password: formData.passwordAcepted
    });
    console.log("updateDataAccount", updateDataAccount);


}
