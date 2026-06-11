'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { User, Phone, MapPin, Calendar, Clock, Activity, MessageSquare, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { DrawalsViewData } from '../model/drawals-model'



interface ViewDetailsWithdrawlsProps {
    IsOpenBool: () => boolean;
    onClose: () => void;
    data: DrawalsViewData | undefined | null;
}

export default function ViewDetailsWithdrawls({ IsOpenBool, onClose, data }: ViewDetailsWithdrawlsProps) {
    if (!data) return null;

    return (
        <Dialog open={IsOpenBool()} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl text-slate-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Detalles del Retiross
                    </DialogTitle>
                    <DialogDescription>
                        Información completa del retiro programado.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {/* Cliente */}
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-full text-red-600">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Cliente</p>
                            <p className="font-semibold text-slate-800">{data.name}</p>
                        </div>
                    </div>

                    {/* Ubicación / Antena */}
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-full text-red-600">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Ubicación</p>
                            <p className="text-slate-800">{data.antenna_name}</p>
                        </div>
                    </div>

                    {/* Teléfonos */}
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-full text-red-600">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Teléfonos</p>
                            <p className="text-slate-800">{data.phone1} {data.phone2 ? `/ ${data.phone2}` : ''}</p>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-full text-red-600">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Estado</p>
                            <Badge variant="secondary" className={`mt-1 ${
                                data.status === 'completado' ? 'bg-green-100 text-green-700' :
                                data.status === 'cancelado' ? 'bg-slate-100 text-slate-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                                {data.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-50 p-2 rounded-full text-red-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Fecha</p>
                                <p className="text-slate-800 text-sm">
                                    {data.day_withdrawal ? format(parseISO(data.day_withdrawal), "dd 'de' MMMM, yyyy", { locale: es }) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-red-50 p-2 rounded-full text-red-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Hora</p>
                                <p className="text-slate-800">{data.hour_withdrawal} hrs</p>
                            </div>
                        </div>
                    </div>

                    {/* Motivo */}
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-full text-red-600">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Motivo del Retiro</p>
                            <p className="text-slate-800">{data.reason}</p>
                        </div>
                    </div>

                    {/* Observaciones */}
                    {data.observations && (
                        <div className="flex items-start gap-3 mt-2">
                            <div className="bg-red-50 p-2 rounded-full text-red-600 mt-1">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Observaciones</p>
                                <p className="text-slate-600 text-sm mt-1 bg-slate-50 p-2 rounded-md border border-slate-100">
                                    {data.observations}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
