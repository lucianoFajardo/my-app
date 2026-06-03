'use server'
import { createClient } from "@/utils/supabase/server"
import { pendingRepairDataModel } from "../model/show-data-repair-model";

export async function showDataRepairAction() {
    const supabase = await createClient();
    try {
        //* --> Traer la data que necesitamos para mostrar en el formulario y luego de eso podemos mostrar en el formulario de reparacion.
        const { data, error } = await supabase
            .from('repairs')
            .select(`
                id_repair,
                status,
                hour_repair,
                date_repair,
                    clients (
                        name,
                        antenna_name,
                        latitude,
                        longitude,
                        phone1,
                        phone2
                    )
            `)
            .limit(30);
        if (error) {
            throw new Error(`Error al obtener los datos de reparaciones: ${error.message}`);
        }
        const formattedData: pendingRepairDataModel[] = data.map((i) => {
            const clientData = Array.isArray(i.clients) ? i.clients[0] : (i.clients || {});
            return {
                id_repair: i.id_repair,
                status: i.status,
                hour_repair: i.hour_repair,
                date_repair: i.date_repair,
                name: clientData.name || "Sin nombre",
                antenna_name: clientData.antenna_name || "Sin antena",
                latitude: clientData.latitude || "",
                longitude: clientData.longitude || "",
                phone1: clientData.phone1 || "",
                phone2: clientData.phone2 || ""
            }
        })
        return formattedData;
    } catch (error) {
        throw new Error(`Error al mostrar los datos de la reparación '${error}'`);
    }
}