'use server'

import { createClient } from "@/utils/supabase/server";

export default async function totalClientsAction() {
    const supabase = createClient();
    try {
        const data = (await supabase).rpc('total_records').single();
        return data;
    } catch (error) {
        console.error("Error fetching total clients:", error);
        throw new Error("Error fetching total clients");
    }
}
