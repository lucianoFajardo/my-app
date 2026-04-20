'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FormInstalModel, hours_array } from '../../models/form-instal-model'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

import { Inspect, CalendarDays, MapPin, User, FileText } from 'lucide-react';
import createInstalationAction from '../../actions/create-instalation-action';

export default function InstalationPage() {
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormInstalModel>();
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = async (props: FormInstalModel) => {
        setIsLoading(true);
        await createInstalationAction(props).then(() => {
            reset();
            setTimeout(() => {
                setIsLoading(false);
                reset();
            }, 1000);
        }).catch(() => {
            setIsLoading(false);
        })
        reset();
    }

    return (
        <div className="p-4 md:p-8 w-full max-w-5xl mx-auto">
            <Card className="bg-white rounded-xl shadow-sm border-border">
                <CardHeader className="border-b pb-6 px-6 md:px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Inspect className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">Registro de Instalación</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">
                                Ingresa la información del cliente y programa la fecha y hora de la instalación.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <User className="h-5 w-5 text-gray-500" />
                                <h3>Datos del Cliente</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor='name_client'>Nombre completo</Label>
                                    <Input id='name_client' placeholder="Ej. Juan Pérez" {...register('name_client', { required: true, pattern: /^[A-Za-z\s]+$/ })} />
                                    {errors.name_client && <span className="text-destructive text-xs font-medium">Debe ingresar solo letras y espacios.</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor='phone1'>Teléfono Principal</Label>
                                    <Input id='phone1' placeholder="123456789" type='number' {...register('phone1', { required: true, pattern: /^\d{9}$/ })} />
                                    {errors.phone1 && <span className="text-destructive text-xs font-medium">Debe contener exactamente 9 dígitos.</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor='phone2'>Teléfono Secundario <span className="text-muted-foreground text-xs font-normal">(Opcional)</span></Label>
                                    <Input id='phone2' placeholder="123456789" type='number' {...register('phone2', { pattern: /^\d{9}$/ })} />
                                    {errors.phone2 && <span className="text-destructive text-xs font-medium">Si se ingresa, deben ser 9 dígitos.</span>}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <MapPin className="h-5 w-5 text-gray-500" />
                                <h3>Ubicación</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor='address'>Dirección de instalación</Label>
                                    <Input id='address' placeholder="Calle, número, zona" {...register('address', { required: true })} />
                                    {errors.address && <span className="text-destructive text-xs font-medium">La dirección es requerida.</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor='gps_coords'>Coordenadas GPS</Label>
                                    <Input id='gps_coords' placeholder="Ej. -12.04318, -77.02824" {...register('gps_coords', { required: true, pattern: /^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/ })} />
                                    {errors.gps_coords && <span className="text-destructive text-xs font-medium">Formato inválido (Ej: latitud, longitud).</span>}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <CalendarDays className="h-5 w-5 text-gray-500" />
                                <h3>Programación</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor='date_instalation'>Fecha de instalación</Label>
                                    <Input id='date_instalation' type='date' {...register('date_instalation', { required: true })} />
                                    {errors.date_instalation && <span className="text-destructive text-xs font-medium">La fecha es requerida.</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor='hour_instalation'>Hora de instalación</Label>
                                    <Controller
                                        name="hour_instalation"
                                        control={control}
                                        rules={{ required: "Debes seleccionar una hora" }}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger id="hour_instalation" className="w-full">
                                                    <SelectValue placeholder="Selecciona una hora" />
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
                                    {errors.hour_instalation && <span className="text-destructive text-xs font-medium">{errors.hour_instalation.message}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <FileText className="h-5 w-5 text-gray-500" />
                                <h3>Notas adicionales</h3>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='notes_instalation'>Observaciones <span className="text-muted-foreground text-xs font-normal">(Opcional)</span></Label>
                                <Textarea
                                    id='notes_instalation'
                                    placeholder="Detalles sobre el acceso al domicilio, requerimientos de equipos extra, etc."
                                    className="resize-none min-h-[100px]"
                                    {...register('notes_instalation')}
                                />
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <Button type='submit' className="w-full md:w-auto" disabled={isLoading}>
                                {isLoading ? 'Registrando...' : 'Registrar Instalación'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}