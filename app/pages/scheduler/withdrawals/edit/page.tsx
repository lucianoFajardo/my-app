'use client'

import React, { useEffect, useState } from 'react'
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    parseISO
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, CheckCircle2, X, Phone, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DrawalsViewData } from '../model/drawals-model'
import ViewDetailsWithdrawls from '../form/view-details-withdrawls'
import { weekDays } from '../../instalation/models/calendar-instal-model'
import showDataDrawalsAction from '../actions/show-data-drawals'
import updateStatusDrawalsAction from '../actions/update-status-drawals'
import deleteDataDrawalsAction from '../actions/delete-data-drawals'
import DeleteDialog from '../delete/delete-dialog'

export default function CalendarWithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState<DrawalsViewData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        //* --> Agregar acción del backend aquí para traer la data.
        const fetchWithdrawals = async () => {
            try {
                await showDataDrawalsAction({ from: 0, to: 10 }).then((res) => {
                    setWithdrawals(res);
                    setLoading(false);
                }).catch(e => { throw new Error("Error fetching withdrawals: " + e); });
            } catch (error) {
                throw new Error("Error fetching withdrawals: " + error);
            }
        }
        fetchWithdrawals();
    }, [])

    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [selectDelete, setSelectDelete] = useState<DrawalsViewData>();
    const [isOpenDetails, setIsOpenDetails] = useState(false);
    const [selectDetails, setSelectDetails] = useState<DrawalsViewData>();

    //* --> Estados para el calendario y fechas que se seleccionan 
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    //* --> Navegación de meses
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    //* --> Construcción del grid del mes
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })


    //* --> Retiros del día seleccionado
    const selectedDayWithdrawals = (withdrawals ?? []).filter(w =>
        w.day_withdrawal && isSameDay(parseISO(w.day_withdrawal), selectedDate)
    ).sort((a, b) => (a.hour_withdrawal || "").localeCompare(b.hour_withdrawal || ""))

    //* --> Estadísticas
    const currentMonthWithdrawals = (withdrawals ?? []).filter(w =>
        w.day_withdrawal && isSameMonth(parseISO(w.day_withdrawal), currentMonth)
    )
    const totalProgramados = currentMonthWithdrawals.length
    const totalCompletados = currentMonthWithdrawals.filter(w => w.status === 'completado').length
    const progressPercentage = totalProgramados === 0 ? 0 : (totalCompletados / totalProgramados) * 100

    //* --> Accion para marcar el retiro como completado
    const markAsCompleted = async (value: DrawalsViewData) => {
        try {
            //* --> fn para actualizar el estado del retiro a 'completado' en la db
            await updateStatusDrawalsAction(value.id_withdrawal).then(() => {
                setWithdrawals((prev) => prev?.map((p) =>
                    p.id_withdrawal === value.id_withdrawal ?
                        { ...p, status: 'completado' } : p
                ));
            }).catch(e => { throw new Error("Error updating withdrawal status: " + e); });
        } catch (error) {
            throw new Error("Error al marcar el retiro como completado: " + error);
        }
    }

    //* --> Abrir modal de confirmación para cancelar retiro
    const handleDelete = (value: DrawalsViewData) => {
        setSelectDelete(value);
        setIsOpenDelete(true);
    }

    //* --> Eliminar retiro
    const deleteWithdrawal = async () => {
        try {
            //* --> Fn para llamar a db y eliminar/cancelar el retiro
            await deleteDataDrawalsAction(selectDelete!.id_withdrawal).then(() => {
                console.log("Retiro eliminado correctamente");
                if (selectDelete) {
                    setWithdrawals(prev => prev?.filter(w => w.id_withdrawal !== selectDelete.id_withdrawal));
                    setIsOpenDelete(false);
                    setSelectDelete(undefined);
                }
            }).catch(e => { throw new Error("Error deleting withdrawal: " + e); });
        } catch (error) {
            throw new Error("Error al eliminar el retiro: " + error);
        }
    }

    //* --> Mostrar detalles en un modal
    const handleShowDetails = (value: DrawalsViewData) => {
        setSelectDetails(value);
        setIsOpenDetails(true);
    }

    if (loading) {
        return (
            <div className="flex w-full h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></span>
                    <span className="text-muted-foreground font-medium text-sm animate-pulse">Cargando datos...</span>
                </div>
            </div>
        );
    }


    return (
        <div className="p-6 m-4 max-w-[1400px] mx-auto space-y-6 border rounded-2xl bg-white shadow-sm ">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Agenda de Retiros</h1>
                    <p className="text-slate-500">Gestiona los horarios y estados de los retiros de equipos.</p>
                </div>
            </div>
            {/* Resumen Mensual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Total Programados</p>
                            <h3 className="text-2xl font-bold text-blue-900">{totalProgramados}</h3>
                        </div>
                        <Package className="w-8 h-8 text-blue-300" />
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Completados</p>
                            <h3 className="text-2xl font-bold text-green-900">{totalCompletados}</h3>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-green-300" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-4 flex flex-col justify-center h-full">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-600">Progreso del Mes</span>
                            <span className="font-bold text-slate-800">{progressPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* CALENDARIO */}
                <Card className="xl:col-span-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-6">
                        <CardTitle className="text-2xl font-bold capitalize">
                            {format(currentMonth, 'MMMM yyyy', { locale: es })}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-full">
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-full">
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="grid grid-cols-7 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="text-center text-xs font-semibold text-slate-400 pb-4 border-b">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 border-l border-t border-slate-100/50">
                            {daysInMonth.map((day, idx) => {
                                const isCurrentMonth = isSameMonth(day, currentMonth)
                                const isSelected = isSameDay(day, selectedDate)
                                const isToday = isSameDay(day, new Date())
                                const dayEvents = (withdrawals ?? []).filter(w => w.day_withdrawal && isSameDay(parseISO(w.day_withdrawal), day))
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setCurrentMonth(day)
                                            setSelectedDate(day)
                                        }}
                                        className={cn(
                                            "min-h-[120px] p-2 border-r border-b border-slate-100/50 cursor-pointer transition-colors relative",
                                            !isCurrentMonth && "bg-slate-50/50 text-slate-400",
                                            isSelected && "ring-2 ring-inset ring-blue-600 bg-blue-50/10",
                                            "hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn(
                                                "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                                                isToday && "bg-blue-600 text-white",
                                                !isToday && !isCurrentMonth && "text-slate-400"
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-col gap-1 overflow-hidden max-h-[70px]">
                                            {dayEvents.slice(0, 3).map(event => (
                                                <div
                                                    key={event.id_withdrawal}
                                                    className={cn(
                                                        "text-[10px] px-2 py-1 rounded truncate font-medium",
                                                        event.status === 'completado'
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-orange-100 text-orange-700"
                                                    )}
                                                >
                                                    {event.hour_withdrawal} hrs
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-[10px] text-slate-500 pl-1">
                                                    +{dayEvents.length - 3} más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* DETALLES DEL DIA */}
                <div className="flex flex-col gap-6">
                    <Card className="flex-1 shadow-sm rounded-2xl border-slate-200">
                        <CardHeader className="flex flex-row items-start justify-between pb-4">
                            <div className="flex gap-3 items-center">
                                <CalendarIcon className="h-6 w-6 text-blue-600" />
                                <div>
                                    <CardTitle>Detalles del Día</CardTitle>
                                </div>
                            </div>
                            <div className="text-right text-sm text-slate-500 font-medium capitalize">
                                {format(selectedDate, 'dd MMM yyyy', { locale: es })}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ScrollArea className="h-[600px] pr-4">
                                {selectedDayWithdrawals.length === 0 ? (
                                    <div className="text-center text-slate-400 py-10">
                                        No hay retiros para este día.
                                    </div>
                                ) : (
                                    selectedDayWithdrawals.map(w => (
                                        <div key={w.id_withdrawal} className="border border-slate-200 rounded-xl p-4 shadow-sm bg-white relative mb-4 hover:shadow-md transition-shadow hover:bg-slate-50">
                                            <div className="flex justify-between items-center mb-3 p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center text-sm font-medium text-slate-500 gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    {w.hour_withdrawal + ' hrs'}
                                                </div>
                                                <Badge variant="secondary" className={
                                                    w.status === 'completado' ? 'bg-green-100 text-green-700' : 'bg-orange-50 text-orange-700'
                                                }>
                                                    {w.status === 'completado' ? 'COMPLETADO' : 'PROGRAMADO'}
                                                </Badge>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg mb-1">{w.name}</h3>
                                                <div className="flex flex-col gap-1 mb-3">
                                                    <span className="text-sm text-slate-500 flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {w.antenna_name}
                                                    </span>
                                                    <span className="text-sm text-slate-500 flex items-center gap-1.5">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {w.phone1}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                {w.status !== 'completado' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                                                        onClick={() => markAsCompleted(w)}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Completar
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleDelete(w)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-slate-200 hover:bg-slate-50"
                                                    onClick={() => handleShowDetails(w)}
                                                >
                                                    Ver Detalles
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/*--> Modal de Detalles del Retiro */}
            {selectDetails && isOpenDetails && (
                <ViewDetailsWithdrawls
                    IsOpenBool={() => isOpenDetails}
                    onClose={() => setIsOpenDetails(false)}
                    data={selectDetails}
                />
            )}

            {/* Modal de Eliminación Integrado */}
            {selectDelete && isOpenDelete && (
                <DeleteDialog
                    isOpen={isOpenDelete}
                    onDelete={deleteWithdrawal}
                    onCancel={() => setIsOpenDelete(false)}
                    props={selectDelete}
                />
            )}
        </div>
    )
}