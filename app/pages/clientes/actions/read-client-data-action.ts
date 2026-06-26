"use server"

import { createClient } from "@/utils/supabase/server";
import { ClienteModel, ClientPaymentInfo } from "../models/client-model";
import { ViewStateClientPaymentInfoInterface } from "../models/payment-model";

export default async function readClientDataAction({ from, to, searchParam }: { from: number; to: number, searchParam?: string }): Promise<ClienteModel[]> {
    try {
        const supabase = await createClient();
        let query = supabase.from('clients').select('*');
        if (searchParam) {
            query = query.or(`name.ilike.%${searchParam}%,lastname.ilike.%${searchParam}%,antenna_name.ilike.%${searchParam}%`);
        }
        const { data, error } = await query.range(from, to);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        throw new Error("Error al leer los datos del cliente: " + (error as Error).message);
    }
}

export async function getClientById(id: string): Promise<ClienteModel | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id_client', id)
            .single();
        if (error) {
            throw error;
        }
        return data as ClienteModel;
    } catch (error) {
        throw new Error("Error al leer el cliente por id", error as Error);
    }
}

export async function getClientPaymentSnapshotById(
    id: string
): Promise<ViewStateClientPaymentInfoInterface | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('view_control_services_payment')
            .select('*')
            .eq('id_client', id)
            .single();
        if (error) {
            throw error;
        }
        return data as ViewStateClientPaymentInfoInterface;
    } catch (error) {
        throw new Error('Error al leer el snapshot de pago del cliente: ' + (error as Error).message);
    }
}


export interface ClientPaymentPageResult {
    data: ViewStateClientPaymentInfoInterface[];
    count: number;
}

export const DataClientPaymentInfo = async ({
    from,
    to,
    searchParam,
    statusParam
}: {
    from: number;
    to: number;
    searchParam?: string;
    statusParam?: string;
}): Promise<ClientPaymentPageResult> => {
    try {
        const supabase = await createClient();
        //* --> Apuntamos a la VISTA que cree en lugar de la tabla 'clients'
        let query = supabase.from('view_control_services_payment')
            .select('*', { count: 'exact' })
            .order('covered_up_to', { ascending: true });

        if (statusParam && statusParam.trim() !== '' && statusParam !== 'TODOS') {
            query = query.eq('status_pay_client', statusParam);
        }

        //* --> Filtro de búsqueda (Adaptado a las columnas de tu vista)
        if (searchParam?.trim()) {
            query = query.or(`client.ilike.%${searchParam}%,status_pay_client.ilike.%${searchParam}%`);
        }
        //* --> Paginación y ejecución en un solo paso
        const { data, error, count } = await query.range(from, to);
        if (error) {
            throw error;
        }
        //* --> Retornamos los datos limpios y listos para mostrar al cliente los datos.
        return { data: data as ViewStateClientPaymentInfoInterface[], count: count ?? 0 };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Error al seleccionar los datos del cliente: ${errorMessage}`);
    }
}

export const formatClientPaymentInfo = async (prompt: ClienteModel) => {
    const getData: ClientPaymentInfo = {
        id_client: prompt.id_client,
        name: prompt.name,
        lastname: prompt.lastname,
        antenna_name: prompt.antenna_name,
        initial_payment: prompt.initial_payment,
        paid_until_date: prompt.paid_until_date,
        plan: prompt.plan,
        phone1: prompt.phone1,
        phone2: prompt.phone2,
        paidMonths: [],
        created_at: new Date(prompt.created_at),
        planStatus: 'due',
        monthsDue: [],
        payments: [],
        range_payment: prompt.range_payment
    }
    return getData;
}