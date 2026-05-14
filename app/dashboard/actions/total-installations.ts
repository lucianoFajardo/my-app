'use server'

import { createClient } from "@/utils/supabase/server"

export default async function totalInstallationsAction() {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.rpc('get_installations_today');
        if (error) {
            return error;
        }
        if (data != null) {
            console.log("Total installations today:", data);
            return data;
        }
        
        return 0;
    } catch (error) {
        throw error;
    }
}
