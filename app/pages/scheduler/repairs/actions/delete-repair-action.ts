'use server'

import { createClient } from "@/utils/supabase/server"
import { pendingRepairDataModel } from "../model/show-data-repair-model";

export default async function deleteRepairAction(value: pendingRepairDataModel) {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase.from('repairs').delete().eq('id_repair', value.id_repair).single();
        if (error) throw error
        console.log("Repair deleted successfully", data)
        return data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error("Error deleting repair")
    }
}