export type ReminderType = "money" | "installation" | "other";

export interface ReminderClient {
  readonly id_client: string;
  name: string;
  lastname: string;
  antenna_name: string;
  phone1?: string;
  phone2?: string;
}

export interface ReminderFormModel {
  reminder_type: ReminderType;
  start_date: string;
  end_date: string;
  notes: string;
}

export interface CreateReminderModel extends ReminderFormModel {
  client_key: string;
}

export interface ReminderItem {
  id_reminders: string;
  client_key: string;
  reminder_type: ReminderType;
  start_date: string;
  end_date: string;
  notes: string;
  clients: Pick<ReminderClient, "name" | "lastname" | "antenna_name"> | null;
}
