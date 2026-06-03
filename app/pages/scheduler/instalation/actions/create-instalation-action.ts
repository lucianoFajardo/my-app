'use server'

import { createClient } from "@/utils/supabase/server";
import { FormInstalModel } from "../models/form-instal-model";

export default async function createInstalationAction(
    dataGet: FormInstalModel) {
    //* --> recibimos la info y la transfomamos al modelo que necesitamos
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('installations').insert([dataGet]);
        if (error) {
            throw new Error("Error al insertar en la base de datos");
        }
        return data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error("Error al insertar en la base de datos");
    }
}