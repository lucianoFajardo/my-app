"use client"

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ClienteModel } from "../models/client-model";
import { Button } from "@/components/ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { plans, rangePaymentDates, sectors } from "../models/select-drops-data-model";
import { Textarea } from "@/components/ui/textarea";
import { UpdateClientAction } from "../actions/update-client-action";
import { formatDateRangeAction } from "../actions/format-date-range-action";
import { DialogDescription } from "@radix-ui/react-dialog";
import { MapPin, Pencil, Signal, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface ClienteEditProps {
    cliente: ClienteModel;
    isOpen: boolean;
    onCancel?: () => void;
    onSubmit?: (data: ClienteModel) => void;
}

export function CardEditCliente({ cliente, onCancel, isOpen, onSubmit }: ClienteEditProps) {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: { ...cliente }
    });
    const planValue = watch("plan");
    const sectorValue = watch("sector");

    const onEditSubmit = async (data: ClienteModel) => {
        if (data.initial_payment != cliente.initial_payment) {
            data.initial_payment = formatDateRangeAction(data.initial_payment);
        } else {
            data.initial_payment = cliente.initial_payment;
        }
        const dataGet = { ...data };
        await UpdateClientAction(dataGet.id_client!, dataGet)
            .then(() => {
                alert("Cliente actualizado con éxito");
                if (onSubmit) onSubmit(dataGet);
            })
            .catch((error) => {
                throw new Error("Error al actualizar los datos del cliente", error as Error);
            });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="max-w-3xl p-0 mx-auto rounded-xl shadow-xl bg-card border-border/60 overflow-hidden">
                <DialogHeader className="bg-muted/30 px-6 py-5 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Pencil className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                                Editar Cliente
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1">
                                Actualizando datos de <span className="font-semibold text-primary">{cliente.name} {cliente.lastname}</span>.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit((data) => {
                        onEditSubmit(data);
                        if (onCancel) onCancel();
                    })}
                >
                    <div className="px-6 py-6 max-h-[65vh] overflow-y-auto space-y-6">

                        {/* Datos Generales */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-foreground">
                                <User className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-sm">Datos Generales</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Nombre</Label>
                                    <Input id="name" className="h-9 text-sm bg-background" {...register("name", { required: true, pattern: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/ })} />
                                    {errors.name && <span className="text-destructive text-[10px]">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="lastname" className="text-xs font-medium text-muted-foreground">Apellido</Label>
                                    <Input id="lastname" className="h-9 text-sm bg-background" {...register("lastname", { required: true, pattern: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/ })} />
                                    {errors.lastname && <span className="text-destructive text-[10px]">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone1" className="text-xs font-medium text-muted-foreground">Teléfono Principal</Label>
                                    <Input id="phone1" inputMode="numeric" className="h-9 text-sm bg-background" {...register("phone1", { required: true, pattern: /^[0-9]+$/, maxLength: 9 })} />
                                    {errors.phone1 && <span className="text-destructive text-[10px]">Requerido / Inválido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone2" className="text-xs font-medium text-muted-foreground">Teléfono 2</Label>
                                    <Input id="phone2" inputMode="numeric" className="h-9 text-sm bg-background" {...register("phone2", { pattern: /^[0-9]+$/, maxLength: 9 })} />
                                    {errors.phone2?.type === "pattern" && <span className="text-destructive text-[10px]">Solo números</span>}
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border/60" />

                        {/* Servicio */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-foreground">
                                <Signal className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-sm">Servicio y Facturación</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="antennaName" className="text-xs font-medium text-muted-foreground">Nombre Antena</Label>
                                    <Input id="antennaName" className="h-9 text-sm bg-background" {...register("antenna_name", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                                    {errors.antenna_name && <span className="text-destructive text-[10px]">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="sector" className="text-xs font-medium text-muted-foreground">Sector</Label>
                                    <Select value={sectorValue} onValueChange={(value) => setValue("sector", value)}>
                                        <SelectTrigger className="h-9 text-sm bg-background">
                                            <SelectValue placeholder="Selecciona un sector" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sectors.map(sect => (
                                                <SelectItem key={sect.value} value={sect.value}>{sect.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.sector && <span className="text-destructive text-[10px]">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="plan" className="text-xs font-medium text-muted-foreground">Plan Costo</Label>
                                    <Select value={planValue} onValueChange={(value) => setValue("plan", value)}>
                                        <SelectTrigger className="h-9 text-sm bg-background">
                                            <SelectValue placeholder="Selecciona un plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {plans.map(plan => (
                                                <SelectItem key={plan.value} value={plan.value}>{plan.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.plan && <span className="text-destructive text-[10px]">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="initialPayment" className="text-xs font-medium text-muted-foreground">Rango Fecha de Pago (Anterior: {cliente.initial_payment})</Label>
                                    <Select onValueChange={(value) => {
                                        setValue("initial_payment", value)
                                        setValue("range_payment", value)
                                    }}>
                                        <SelectTrigger className="h-9 text-sm bg-background">
                                            <SelectValue placeholder="Selecciona un rango" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rangePaymentDates.map(rango => (
                                                <SelectItem key={rango.value} value={rango.value}>{rango.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.initial_payment && <span className="text-destructive text-[10px]">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="nombreTecnico" className="text-xs font-medium text-muted-foreground">Nombre Técnico Asignado</Label>
                                    <Input id="nombreTecnico" className="h-9 text-sm bg-background" {...register("technical_name", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                                    {errors.technical_name && <span className="text-destructive text-[10px]">Requerido</span>}
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border/60" />

                        {/* Ubicación y Extras */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-foreground">
                                <MapPin className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-sm">Ubicación y Notas</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="latitude" className="text-[11px] uppercase tracking-wider text-muted-foreground">Latitud</Label>
                                    <Input id="latitude" className="h-9 text-sm font-mono bg-background" {...register("latitude", { required: true, pattern: /^-?\d+(\.\d+)?$/ })} />
                                    {errors.latitude && <span className="text-destructive text-[10px]">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="longitude" className="text-[11px] uppercase tracking-wider text-muted-foreground">Longitud</Label>
                                    <Input id="longitude" className="h-9 text-sm font-mono bg-background" {...register("longitude", { required: true, pattern: /^-?\d+(\.\d+)?$/ })} />
                                    {errors.longitude && <span className="text-destructive text-[10px]">Requerido</span>}
                                </div>
                                <div className="md:col-span-2 space-y-1.5 mt-2">
                                    <Label htmlFor="observations" className="text-xs font-medium text-muted-foreground">Observaciones Adicionales</Label>
                                    <Textarea id="observations" className="min-h-80px bg-background text-sm resize-none" {...register("observations")} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="bg-muted/30 border-t px-6 py-4 flex items-center justify-end gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="shadow-sm min-w-[120px]">
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}