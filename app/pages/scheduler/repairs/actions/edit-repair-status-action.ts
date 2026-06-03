'use server'

import { createClient } from "@/utils/supabase/server"
import { pendingRepairDataModel } from "../model/show-data-repair-model";

export default async function editRepairStatusAction(value: pendingRepairDataModel) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('repairs').update({ status: 'completed' }).eq('id_repair', value.id_repair).single();
        if (error) {
            console.error("Error updating repair status: ", error);
            throw error
        }
        console.log("Repair status updated successfully", data)
        return data;
    } catch (error) {
        throw new Error("Error updating repair status: " + error);
    }
}