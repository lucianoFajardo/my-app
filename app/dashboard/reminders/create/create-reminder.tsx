"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BellRing, CircleDollarSign, FileText, MapPin, Save, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createReminder, searchReminderClients } from "../actions/reminder-actions";
import { ReminderClient, ReminderFormModel } from "../model/reminder-model";

interface CreateReminderProps {
  onCreated: () => Promise<void>;
  onError: (message: string) => void;
}

export function CreateReminder({ onCreated, onError }: CreateReminderProps) {
  const { control, getValues, handleSubmit, register, reset, formState: { errors } } = useForm<ReminderFormModel>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ReminderClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<ReminderClient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      const result = await searchReminderClients(term);
      setSearchResults(result.data as ReminderClient[]);
      setIsSearching(false);

      if (result.error) onError("No se pudieron buscar los clientes.");
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm, onError]);

  const selectClient = (client: ReminderClient) => {
    setSelectedClient(client);
    setSearchTerm("");
    setSearchResults([]);
  };

  const submitReminder = async (formData: ReminderFormModel) => {
    if (!selectedClient) return;

    setIsSaving(true);
    const result = await createReminder({ ...formData, client_key: selectedClient.id_client });
    setIsSaving(false);

    if (result.error) {
      onError("No se pudo guardar el recordatorio. Inténtalo de nuevo.");
      return;
    }

    reset();
    setSelectedClient(null);
    await onCreated();
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 px-6 pb-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5"><BellRing className="h-6 w-6 text-primary" /></div>
          <div><CardTitle className="text-2xl font-bold text-slate-800">Nuevo recordatorio</CardTitle><CardDescription className="mt-1">Registra pagos pendientes, instalaciones, retiros u otros pendientes de un cliente.</CardDescription></div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        {!selectedClient ? (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3 text-lg font-semibold text-slate-800"><Search className="h-5 w-5 text-primary" /><h2>Buscar cliente</h2></div>
            <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="h-11 pl-9" placeholder="Nombre, apellido o ubicación del cliente..." type="search" autoFocus /></div>
            {isSearching && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner className="h-4 w-4" /> Buscando clientes...</div>}
            {searchResults.length > 0 && <div className="overflow-hidden rounded-md border border-slate-200">{searchResults.map((client) => <button key={client.id_client} type="button" onClick={() => selectClient(client)} className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50"><span><span className="flex items-center gap-2 font-semibold text-slate-800"><User className="h-4 w-4 text-primary" />{client.name} {client.lastname}</span><span className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5" />{client.antenna_name}</span></span><span className="text-sm text-slate-500">{client.phone1}</span></button>)}</div>}
          </section>
        ) : (
          <div className="space-y-8">
            <section className="space-y-4"><div className="flex items-center gap-2 border-b pb-3 text-lg font-semibold text-slate-800"><User className="h-5 w-5 text-primary" /><h2>Cliente seleccionado</h2></div><div className="flex flex-col justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"><div><p className="font-semibold text-slate-900">{selectedClient.name} {selectedClient.lastname}</p><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5" />{selectedClient.antenna_name}</p><p className="mt-1 text-sm text-slate-500">{selectedClient.phone2 ? `${selectedClient.phone1} / ${selectedClient.phone2}` : selectedClient.phone1}</p></div><Button type="button" variant="outline" onClick={() => setSelectedClient(null)} disabled={isSaving}>Cambiar cliente</Button></div></section>
            <form onSubmit={handleSubmit(submitReminder)} className="space-y-8">
              <section className="space-y-4"><div className="flex items-center gap-2 border-b pb-3 text-lg font-semibold text-slate-800"><CircleDollarSign className="h-5 w-5 text-primary" /><h2>Información del recordatorio</h2></div><div className="grid gap-6 md:grid-cols-3"><div className="space-y-2"><Label htmlFor="reminder_type">Tipo de recordatorio</Label><Controller name="reminder_type" control={control} rules={{ required: "Selecciona un tipo" }} render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger id="reminder_type"><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger><SelectContent><SelectItem value="money">Dinero</SelectItem><SelectItem value="installation">Instalación</SelectItem><SelectItem value="other">Otro</SelectItem></SelectContent></Select>} />{errors.reminder_type && <p className="text-xs font-medium text-destructive">{errors.reminder_type.message}</p>}</div><div className="space-y-2"><Label htmlFor="start_date">Fecha de inicio</Label><Input id="start_date" type="date" {...register("start_date", { required: "Ingresa una fecha de inicio" })} />{errors.start_date && <p className="text-xs font-medium text-destructive">{errors.start_date.message}</p>}</div><div className="space-y-2"><Label htmlFor="end_date">Fecha límite</Label><Input id="end_date" type="date" {...register("end_date", { required: "Ingresa una fecha límite", validate: (value) => value >= getValues("start_date") || "Debe ser igual o posterior a la fecha inicial" })} />{errors.end_date && <p className="text-xs font-medium text-destructive">{errors.end_date.message}</p>}</div></div></section>
              <section className="space-y-4"><div className="flex items-center gap-2 border-b pb-3 text-lg font-semibold text-slate-800"><FileText className="h-5 w-5 text-primary" /><h2>Nota</h2></div><div className="space-y-2"><Label htmlFor="notes">Detalle del pendiente</Label><Textarea id="notes" className="min-h-30 resize-y" placeholder="Ej.: El cliente solicitó esperar su pago hasta el viernes..." {...register("notes", { required: "Describe el recordatorio" })} />{errors.notes && <p className="text-xs font-medium text-destructive">{errors.notes.message}</p>}</div></section>
              <div className="flex flex-col-reverse justify-end gap-3 border-t pt-6 sm:flex-row"><Button type="button" variant="outline" onClick={() => setSelectedClient(null)} disabled={isSaving}>Cancelar</Button><Button type="submit" disabled={isSaving}>{isSaving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}{isSaving ? "Guardando..." : "Crear recordatorio"}</Button></div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}