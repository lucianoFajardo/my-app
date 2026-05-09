'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { CalendarModelDataInstal } from '../models/calendar-instal-model'
import { User, Phone, MapPin, Calendar, Clock, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

interface ShowDetailsProps {
    open: boolean;
    onClose: () => void;
    data: CalendarModelDataInstal | undefined;
}

export default function ShowDetails({ open, onClose, data }: ShowDetailsProps) {
    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Detalles de Instalación</DialogTitle>
                    <DialogDescription>
                        Información completa del servicio programado.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {/* Cliente */}
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Cliente</p>
                            <p className="font-semibold text-slate-800">{data.name_client}</p>
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Dirección</p>
                            <p className="text-slate-800">{data.address}</p>
                        </div>
                    </div>

                    {/* Teléfonos */}
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Teléfonos</p>
                            <p className="text-slate-800">{data.phone1} {data.phone2 ? `/ ${data.phone2}` : ''}</p>
                        </div>
                    </div>

                    {/* Fecha y Hora en columnas combinadas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Fecha</p>
                                <p className="text-slate-800 text-sm">
                                    {format(parseISO(data.date_instalation), "dd 'de' MMMM, yyyy", { locale: es })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Hora</p>
                                <p className="text-slate-800">{data.hour_instalation} hrs</p>
                            </div>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center gap-3 mt-2">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Estado</p>
                            <Badge variant="secondary" className={
                                data.status === 'completed' ? 'bg-green-100 text-green-700 mt-1' : 'bg-yellow-100 text-yellow-700 mt-1'
                            }>
                                {data.status === 'completed' ? 'LISTO' : 'PENDIENTE'}
                            </Badge>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}