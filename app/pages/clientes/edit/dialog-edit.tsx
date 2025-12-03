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

export interface ClienteEditProps {
    cliente: ClienteModel;
    isOpen: boolean;
    onCancel?: () => void;
    onSubmit?: (data: ClienteModel) => void;
}

export function CardEditCliente({ cliente, onCancel, isOpen , onSubmit}: ClienteEditProps) {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: { ...cliente }
    });
    const planValue = watch("plan");
    const sectorValue = watch("sector");

    const onEditSubmit = async (data: ClienteModel) => {
        console.log("Form data submitted:", data);
        if (data.paymentDate != cliente.paymentDate) {
            data.paymentDate = formatDateRangeAction(data.paymentDate);
        } else {
            data.paymentDate = cliente.paymentDate;
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

    //TODO; Solucionar el problema de las fechas que me muestra una fecha errone al actulizar los datos

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="max-w-2xl mx-auto rounded-xl shadow-2xl bg-white p-3">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-primary-700 mb-2">
                        Editar Cliente: {cliente.name} {cliente.lastname}
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit((data) => {
                        onEditSubmit(data);
                        if (onCancel) onCancel();
                    })}
                >
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-2"
                    >
                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" {...register("name", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                            {errors.name && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="lastname">Apellido</Label>
                            <Input id="lastname" {...register("lastname", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                            {errors.lastname && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="antennaName">Nombre Antena</Label>
                            <Input id="antennaName" {...register("antennaName", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                            {errors.antennaName && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="sector">Sector</Label>
                            <Select value={sectorValue} onValueChange={(value) => setValue("sector", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un sector" />
                                </SelectTrigger>
                                <SelectContent className="bg-purple-50">
                                    {sectors.map(sect => (
                                        <SelectItem key={sect.value} value={sect.value}>{sect.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.sector && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="paymentDate">Rango de Fecha de Pago</Label>
                            <p className="text-sm p-2">fecha pago Actual: {cliente.paymentDate}</p>
                            <Select onValueChange={(value) => setValue("paymentDate", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rango de fecha" />
                                </SelectTrigger>
                                <SelectContent className="bg-purple-50">
                                    {rangePaymentDates.map(rango => (
                                        <SelectItem key={rango.value} value={rango.value}>{rango.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.paymentDate && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="plan">Plan</Label>
                            <p className="text-sm p-2">Plan Actual: {cliente.plan}</p>
                            <Select value={planValue} onValueChange={(value) => setValue("plan", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un plan" />
                                </SelectTrigger>
                                <SelectContent className="bg-purple-50">
                                    {plans.map(plan => (
                                        <SelectItem key={plan.value} value={plan.value}>{plan.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plan && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="nombreTecnico">Nombre Técnico</Label>
                            <Input id="nombreTecnico" {...register("technicalName", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                            {errors.technicalName && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="phone1">Teléfono 1</Label>
                            <Input id="phone1" inputMode="numeric"  {...register("phone1", { required: true, pattern: /^[0-9]+$/, maxLength: 9 })} />
                            {errors.phone1 && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                            {errors.phone1?.type === "pattern" && <span className="text-red-500 text-xs">Formato inválido, ingresa solo números</span>}
                        </div>
                        <div>
                            <Label htmlFor="phone2">Teléfono 2</Label>
                            <Input id="phone2" inputMode="numeric" {...register("phone2", { pattern: /^[0-9]+$/, maxLength: 9 })} />
                            {errors.phone2?.type === "pattern" && <span className="text-red-500 text-xs">Formato inválido, ingresa solo números</span>}
                        </div>
                        <div>
                            <Label htmlFor="latitude">Latitud</Label>
                            <Input id="latitude" {...register("latitude", { required: true, pattern: /^-?\d+(\.\d+)?$/ })} />
                            {errors.latitude && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="longitude">Longitud</Label>
                            <Input id="longitude" {...register("longitude", { required: true, pattern: /^-?\d+(\.\d+)?$/ })} />
                            {errors.longitude && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="observations">Observaciones</Label>
                            <Textarea id="observations" {...register("observations")} />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <DialogClose asChild>
                            <Button type="button" onClick={onCancel} className="bg-purple-200 hover:bg-gray-300 text-gray-700">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit">
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}