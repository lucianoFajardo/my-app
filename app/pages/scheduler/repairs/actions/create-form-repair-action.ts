'use server';

import { createClient } from "@/utils/supabase/server";
import { RepairFormModel } from "../model/form-repair-model";

export default async function createRepairAction(props: RepairFormModel) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('repairs').insert({
            client_key: props.client_key,
            date_repair: props.date_repair,
            hour_repair: props.hour_repair,
            notes: props.notes,
        }).select();
        if (error) {
            return { data: null, error: error.message }
        }
        return { data, error: null }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error('Error al guardar la reparación');
    }
}