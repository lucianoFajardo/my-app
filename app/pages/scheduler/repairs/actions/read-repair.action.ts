'use server'

import { createClient } from "@/utils/supabase/server"

export async function readClientDataActionRepair(props: string) {
    const supabase = await createClient();
    try {
        //* --> Traer la data que necesitamos para mostrar en el formulario y luego de eso podemos mostrar en el formulario de reparacion.
        if (!props || props.trim() === '') return { data: null }
        const { data, error } = await supabase
            .from('clients')
            .select('id_client,name,lastname,antenna_name,latitude,longitude,phone1,phone2')
            .or(`name.ilike.%${props}%,lastname.ilike.%${props}%,antenna_name.ilike.%${props}%`)
            .limit(15);
        if (error) {
            throw new Error(`Error al obtener los datos del cliente: ${error.message}`);
        }
        return { data, error: null }
    } catch (error) {
        throw new Error(`Error al leer los datos del cliente '${error}'`);
    }
}
