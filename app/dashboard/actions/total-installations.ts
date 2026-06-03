'use server'

import { createClient } from "@/utils/supabase/server"

export default async function totalInstallationsAction() {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.rpc('get_installations_today');
        if (error) {
            throw new Error("Error fetching total installations: " + error.message);
        }
        if (data != null) {
            return data;
        }
        return 0;
    } catch (error) {
        throw error;
    }
}
