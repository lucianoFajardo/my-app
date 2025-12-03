"use server"

import { createClient } from "@/utils/supabase/server";
import { ClienteModel } from "../models/client-model"

export async function createClientNetworkAction(dataRes: ClienteModel) {
    try {
        const supabase = await createClient();
        const { data: res, error } = await supabase.from("clients").insert(dataRes).select().single();
        if (error) throw error;
        return res;
    } catch (error) {
        console.error("Error creating client:", error)
    }
}