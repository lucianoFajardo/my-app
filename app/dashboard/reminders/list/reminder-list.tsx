"use client";

import { useState } from "react";
import { CalendarDays, Clock3, Loader2, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteReminder } from "../actions/reminder-actions";
import { ReminderItem, ReminderType } from "../model/reminder-model";

interface ReminderListProps {
  reminders: ReminderItem[];
  isLoading: boolean;
  onDeleted: (idReminder: string) => void;
  onError: (message: string) => void;
}

const reminderTypeLabel: Record<ReminderType, string> = {
  money: "Dinero",
  installation: "Instalación",
  other: "Otro",
};

export function ReminderList({
  reminders,
  isLoading,
  onDeleted,
  onError,
}: ReminderListProps) {
  const [reminderToDelete, setReminderToDelete] = useState<ReminderItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const removeReminder = async () => {
    if (!reminderToDelete) return;
    setIsDeleting(true);
    const result = await deleteReminder(reminderToDelete.id_reminders);
    setIsDeleting(false);

    if (result.error) {
      onError("No se pudo eliminar el recordatorio.");
      return;
    }

    onDeleted(reminderToDelete.id_reminders);
    setReminderToDelete(null);
  };

  return (
    <>
      <Card className="mt-6 border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-6 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Clock3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">
                Recordatorios creados
              </CardTitle>
              <CardDescription className="mt-1">
                Pendientes registrados para tus clientes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando
              recordatorios...
            </div>
          ) : reminders.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Todavía no hay recordatorios creados.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id_reminders}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between md:px-8"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {reminder.clients
                          ? `${reminder.clients.name} ${reminder.clients.lastname}`
                          : "Cliente no disponible"}
                      </p>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {reminderTypeLabel[reminder.reminder_type]}
                      </span>
                    </div>
                    {reminder.clients?.antenna_name && (
                      <p className="flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {reminder.clients.antenna_name}
                      </p>
                    )}
                    <p className="max-w-2xl text-sm text-slate-600">
                      {reminder.notes}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Del{" "}
                      {new Date(
                        `${reminder.start_date}T00:00:00`,
                      ).toLocaleDateString("es-ES")}{" "}
                      al{" "}
                      {new Date(
                        `${reminder.end_date}T00:00:00`,
                      ).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setReminderToDelete(reminder)}
                    aria-label={`Eliminar recordatorio de ${reminder.clients?.name ?? "cliente"}`}
                    title="Eliminar recordatorio"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog
        open={Boolean(reminderToDelete)}
        onOpenChange={(open) => !open && setReminderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar recordatorio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el recordatorio de forma permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={removeReminder}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
