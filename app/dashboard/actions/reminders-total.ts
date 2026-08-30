"use server";

import { createClient } from "@/utils/supabase/server";

export default async function getRemindersTotal() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("reminders_total");
    if (error) {
      throw new Error("Error al tratar de cargar los recordatorios");
    }
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al tratar de cargar los recordatorios");
  }
}
