'use server'

import { createClient } from "@/utils/supabase/server"

export async function getTotalWithdrawalsAction() {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('view_control_withdrawals').select('*');
        if (error) {
            throw new Error("Error fetching total withdrawals: " + error.message);
        }
        return data as [];
    } catch (error) {
        throw new Error("Error fetching total withdrawals: " + error);
    }

}