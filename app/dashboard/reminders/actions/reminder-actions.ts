"use server";

import { createClient } from "@/utils/supabase/server";
import { CreateReminderModel, ReminderItem } from "../model/reminder-model";

export async function searchReminderClients(searchTerm: string) {
  const term = searchTerm.trim();

  if (!term) {
    return { data: [], error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id_client, name, lastname, antenna_name, phone1, phone2")
    .or(
      `name.ilike.%${term}%,lastname.ilike.%${term}%,antenna_name.ilike.%${term}%`,
    )
    .limit(20);
  if (error) {
    return { data: [], error: error.message };
  }
  return { data, error: null };
}

export async function createReminder(reminder: CreateReminderModel) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reminders")
    .insert(reminder)
    .select()
    .single();

  
  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getReminders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reminders")
    .select(
      "id_reminders, client_key, reminder_type, start_date, end_date, notes, clients(name, lastname, antenna_name)",
    )
    .order("start_date", { ascending: true });
  
  if (error) {
    return { data: [], error: error.message };
  }

  const reminders: ReminderItem[] = (data ?? []).map((reminder) => ({
    id_reminders: reminder.id_reminders,
    client_key: reminder.client_key,
    reminder_type: reminder.reminder_type,
    start_date: reminder.start_date,
    end_date: reminder.end_date,
    notes: reminder.notes,
    clients: Array.isArray(reminder.clients)
      ? (reminder.clients[0] ?? null)
      : (reminder.clients ?? null),
  }));

  return { data: reminders, error: null };
}

export async function deleteReminder(idReminder: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id_reminders", idReminder);

  return { error: error?.message ?? null };
}
