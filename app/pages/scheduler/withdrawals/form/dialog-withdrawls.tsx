'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { hours_array } from "../../instalation/models/form-instal-model";
import { Input } from "@/components/ui/input";
import { DrawalsClientModel, DrawalsModel } from "../model/drawals-model";

interface DialogWithdrawlsProps {
    isOpen: () => boolean;
    isClose: () => void;
    onSubmit: (data: DrawalsModel) => Promise<DrawalsModel>;
    props: DrawalsClientModel | null;
}

export default function DialogWithdrawls({
    isOpen,
    isClose,
    onSubmit,
    props
}: DialogWithdrawlsProps) {
    const { register, handleSubmit, control, formState: { errors } } = useForm<DrawalsModel>();
    return (
        <Dialog open={isOpen()} onOpenChange={isClose}>
            <DialogContent className="sm:max-w-[500px] border-slate-200">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-800">
                        <CalendarDays className="h-5 w-5 text-red-500" />
                        Agendar Retiro
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Programa la fecha para recuperar los equipos de <strong className="text-slate-800">{props?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
                    {/* Fila de Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium flex items-center gap-1">
                                <CalendarDays className="h-4 w-4 text-slate-400" /> Fecha
                            </Label>
                            <Input
                                type="date"
                                className="border-slate-200 focus-visible:ring-red-500/20"
                                {...register('day_withdrawal', { required: true })}
                            />
                            {errors.day_withdrawal && <span className="text-red-500 text-xs font-medium">La fecha es requerida.</span>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium flex items-center gap-1">
                                <Clock className="h-4 w-4 text-slate-400" /> Hora
                            </Label>
                            <Controller
                                name="hour_withdrawal"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="border-slate-200 focus:ring-red-500/20 w-full">
                                            <SelectValue placeholder="Hora..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hours_array.map((hour) => {
                                                const time = `${hour.toString().padStart(2, '0')}:00`;
                                                return (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.hour_withdrawal && <span className="text-red-500 text-xs font-medium">La hora es requerida.</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Motivo de Baja / Retiro</Label>
                        <Controller
                            name="reason"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="border-slate-200 focus:ring-red-500/20">
                                        <SelectValue placeholder="Selecciona el motivo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="falta_pago">Falta de Pago (Moroso)</SelectItem>
                                        <SelectItem value="baja_voluntaria">Baja Voluntaria</SelectItem>
                                        <SelectItem value="mudanza">Mudanza</SelectItem>
                                        <SelectItem value="fallas_servicio">Fallas en el servicio / Insatisfacción</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.reason && <span className="text-red-500 text-xs font-medium">Por favor selecciona un motivo.</span>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Instrucciones para el técnico <span className="text-slate-400 font-normal">(Opcional)</span></Label>
                        <Textarea
                            {...register('observations')}
                            placeholder="Ej: Llamar antes de ir. Solo retirar antena, router pertenece al cliente..."
                            className="resize-none h-20 border-slate-200 focus-visible:ring-red-500/20 text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" className="border-slate-200 text-slate-700" onClick={isClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white shadow-sm gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Agendar Retiro
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )

}