'use server'
import { createClient } from "@/utils/supabase/server"

export default async function readInstalationAction() {
    const supabase = await createClient();

    // Obtenemos año y mes actuales
    const now = new Date();
    const year = now.getFullYear();
    // getMonth() devuelve de 0 a 11, le sumamos 1 y aseguramos dos dígitos
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Al pasar el día 0 al siguiente mes, obtenemos la cantidad exacta de días del mes actual
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();

    // Fabricamos nuestros strings YYYY-MM-DD
    const firstDate = `${year}-${month}-01`;
    const lastDate = `${year}-${month}-${daysInMonth}`;

    console.log("Buscando fechas desde:", firstDate, "hasta:", lastDate); // <- Esto te ayudará a depurar

    try {
        const { data, error } = await supabase
            .from('installations')
            .select('*')
            // .gte => Mayor o igual que el string 'YYYY-MM-01'
            .gte('date_instalation', firstDate)
            // .lte => Menor o igual que el string 'YYYY-MM-31'
            .lte('date_instalation', lastDate);

        if (error) {
            console.error("Error fetching installations:", error);
            throw error;
        }

        console.log("Instalations this month:", data);
        return data;

    } catch (error) {
        console.error("Catch error:", error);
        throw new Error('Error al leer las instalaciones');
    }
}