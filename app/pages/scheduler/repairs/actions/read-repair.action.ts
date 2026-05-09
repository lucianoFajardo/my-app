'use server'

import { createClient } from "@/utils/supabase/server"
export default async function readRepairAction(props: string) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from('repairs')
            .select('id_repair , client_key (id_client, name , address), status')
            .or(`nombre.ilike.%${props}%,direccion.ilike.%${props}%`)
            .limit(5);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new Error('Error al leer la reparación');
    }
}

export async function readClientDataActionRepair(props: string) {
    const supabase = await createClient();
    try {
        // Traer la data que necesitamos para mostrar en el formulario y luego de eso podemos mostrar en el formulario de reparacion.
        if (!props || props.trim() === '') return { data: null }
        const { data, error } = await supabase
            .from('clients')
            .select('id_client,name,lastname,antennaName,latitude,longitude,phone1,phone2')
            .or(`name.ilike.%${props}%,lastname.ilike.%${props}%,antennaName.ilike.%${props}%`)
            .limit(15);
        if (error) {
            throw new Error(`Error al obtener los datos del cliente: ${error.message}`);
        }
        return { data, error: null }
    } catch (error) {
        throw new Error(`Error al leer los datos del cliente '${error}'`);
    }
}

// TODO -> Seguir aquie stoy en la funcion de la busqueda y en la funcion de crear la reparacion , solucionar el error al traer la data del clientecls