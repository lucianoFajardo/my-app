"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getReminders } from "./actions/reminder-actions";
import { CreateReminder } from "./create/create-reminder";
import { ReminderList } from "./list/reminder-list";
import { ReminderItem } from "./model/reminder-model";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [isLoadingReminders, setIsLoadingReminders] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadReminders = async () => {
    setIsLoadingReminders(true);
    const result = await getReminders();
    
    setReminders(result.data);
    setIsLoadingReminders(false);

    if (result.error) {
      setMessage({ type: "error", text: "No se pudieron cargar los recordatorios." });
    }
  };

  useEffect(() => {
    void loadReminders();
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl p-4 md:p-8">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className={`mb-6 ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : ""}`}>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>{message.type === "success" ? "Guardado" : "Error"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <CreateReminder
        onError={(text) => setMessage({ type: "error", text })}
        onCreated={async () => {
          setMessage({ type: "success", text: "El recordatorio fue creado correctamente." });
          await loadReminders();
        }}
      />
      <ReminderList
        reminders={reminders}
        isLoading={isLoadingReminders}
        onError={(text) => setMessage({ type: "error", text })}
        onDeleted={(idReminder) => {
          setReminders((currentReminders) => currentReminders.filter((reminder) => reminder.id_reminders !== idReminder));
          setMessage({ type: "success", text: "El recordatorio fue eliminado." });
        }}
      />
    </div>
  );
}