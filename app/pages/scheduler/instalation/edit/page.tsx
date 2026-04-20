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
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, CheckCircle2, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarModelDataInstal } from '../../models/calendar-instal-model'
import readInstalationAction from '../../actions/read-instalation-action'
import { ScrollArea } from '@/components/ui/scroll-area'
import updateStatusInstalationAction from '../../actions/update-status-instalation-action'
import AlertDeleteInstalation from '../delete/alert-delete-instalation'


export default function CalendarDashboardPage() {
    const [installations, setInstallations] = useState<CalendarModelDataInstal[]>();
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [selectedInstal, setSelectedInstal] = useState<CalendarModelDataInstal>();
    useEffect(() => {
        // llamamos a la base de datos y alimentamos nuestrar variables
        const fetchData = async () => {
            const res = await readInstalationAction();
            setInstallations(res) // --> aqui asignamos los datos a una variable que podamos ocupar y mostrar en el calendario
        }
        fetchData();
    }, [])

    // Estados para el calendario y fechas que se seleccionan 
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Navegación de meses para cambiar entre los meses del calendarioop
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    // Construcción del grid del mes
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Lunes como inicio
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })

    // Días de la semana para orientar las columnas
    const weekDays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']

    // Instalaciones del día seleccionado (Panel de Detalles) - Filtramos las instalaciones para mostrar solo las del día seleccionado y las ordenamos por hora
    const selectedDayInstallations = (installations ?? []).filter(inst =>
        isSameDay(parseISO(inst.date_instalation), selectedDate)
    ).sort((a, b) => new Date(a.date_instalation).getTime() - new Date(b.date_instalation).getTime())

    // Estadísticas del resumen mensual
    const currentMonthInstallations = (installations ?? []).filter(inst =>
        isSameMonth(parseISO(inst.date_instalation), currentMonth)
    )
    const totalProgramadas = currentMonthInstallations.length
    const totalListas = currentMonthInstallations.filter(i => i.status === 'completed').length
    const totalFaltan = totalProgramadas - totalListas
    const progressPercentage = totalProgramadas === 0 ? 0 : (totalListas / totalProgramadas) * 100

    //* Accion para marcar una instalacion como completada (actualiza el estado de la instalación)
    const markAsCompleted = (value: CalendarModelDataInstal) => {
        try {
            handleStatusChange(value.id_instal);
            // -> actualizamos el estado en el frontEnd para reflejar el cambio y no refrescar la pagina
            setInstallations((prev) => prev?.map((p) =>
                p.id_instal === value.id_instal ?
                    {
                        ...p,
                        status: value.status === 'pending' ? 'completed' : p.status //-> Solo actualiza a completed si estaba pendiente, no permite revertir a pendiente 
                    } : p
            ));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            throw new Error('Error al actualizar el estado de la instalación');
        }
    }

    const handleStatusChange = async (id: string) => {
        await updateStatusInstalationAction(id);
    }


    // Accion para eliminar una instalación (remueve la instalación del estado)
    const deleteInstallation = (id: string) => {
        // Eliminar la instalacion de la base de datos , desplegar un alerta de confirmacion y luego actualizar el estado para removerlo
        // setInstallations(prev => prev.filter(inst => inst.id_instal !== id))
        // TODO : agregar aqui la confirmacion y llamar a la funcion que tengo mas abajo aqui cod: KO12
    }

    return (
        <div className="p-6 m-4 max-w-[1400px] mx-auto space-y-6 border rounded-2xl bg-white shadow-sm ">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Agenda de Instalaciones</h1>
                    <p className="text-slate-500">Gestiona los horarios y estados de tus servicios programados.</p>
                </div>
                {/* <div className="inline-flex items-center rounded-md border p-1 shadow-sm bg-background">
                    <Button variant="secondary" className="px-6 rounded-sm shadow-none">Mes</Button>
                    <Button variant="ghost" className="px-6 rounded-sm text-slate-500">Semana</Button>
                    <Button variant="ghost" className="px-6 rounded-sm text-slate-500">Día</Button>
                </div> */}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/*================ COLUMNA IZQUIERDA: CALENDARIO DE AGENDAMIENTO) ================*/}
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
                        {/* Cabecera de días de la semana */}
                        <div className="grid grid-cols-7 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="text-center text-xs font-semibold text-slate-400 pb-4 border-b">
                                    {day}
                                </div>
                            ))}
                        </div>
                        {/* Cuadrícula de días */}
                        <div className="grid grid-cols-7 border-l border-t border-slate-100/50">
                            {daysInMonth.map((day, idx) => {
                                const isCurrentMonth = isSameMonth(day, currentMonth)
                                const isSelected = isSameDay(day, selectedDate)
                                const isToday = isSameDay(day, new Date())
                                const dayEvents = (installations ?? []).filter(inst => isSameDay(parseISO(inst.date_instalation), day))
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

                                        {/* Insignias de eventos del día en el calendario */}
                                        <div className="mt-2 flex flex-col gap-1 overflow-hidden max-h-[70px]">
                                            {dayEvents.slice(0, 3).map(event => (
                                                <div
                                                    key={event.id_instal}
                                                    className={cn(
                                                        "text-[10px] px-2 py-1 rounded truncate font-medium",
                                                        event.status === 'completed'
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    )}
                                                >
                                                    {event.hour_instalation} {event.name_client.split(' ')[0]}
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

                {/*================ COLUMNA DERECHA: PANELES (Toma 1/3 del espacio) ================*/}
                <div className="flex flex-col gap-6">

                    {/* Panel 1: Detalles del Día */}
                    <Card className="flex-1 shadow-sm rounded-2xl border-slate-200">
                        <CardHeader className="flex flex-row items-start justify-between pb-4">
                            <div className="flex gap-3 items-center">
                                <CalendarIcon className="h-6 w-6 text-blue-600" />
                                <div>
                                    <CardTitle>Detalles del Día</CardTitle>
                                </div>
                            </div>
                            <div className="text-right text-sm text-slate-500 font-medium">
                                {format(selectedDate, 'yyyy-MM-dd')}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ScrollArea className="h-[600px]">
                                {selectedDayInstallations.length === 0 ? (
                                    <div className="text-center text-slate-400 py-10">
                                        No hay instalaciones para este día.
                                    </div>
                                ) : (
                                    selectedDayInstallations.map(inst => (
                                        // Tarjeta de cada instalación del día seleccionado (Agregar un boton para ver mas especificamente la informacion de la persona)
                                        <div key={inst.id_instal} className="border rounded-xl p-4 shadow-sm bg-white relative m-2 hover:shadow-md transition-shadow hover:bg-slate-50">
                                            <div className="flex justify-between items-center mb-3 p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center text-sm font-medium text-slate-500 gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    {inst.hour_instalation + ' hrs'}
                                                </div>
                                                <Badge variant="secondary" className={
                                                    inst.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
                                                }>
                                                    {inst.status === 'completed' ? 'LISTO' : 'PENDIENTE'}
                                                </Badge>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg mb-1">{inst.name_client}</h3>
                                                <div>
                                                    <h2 className="text-sm text-slate-500">{inst.address}</h2>
                                                    <h2 className="text-sm text-slate-500">{inst.phone1}</h2>
                                                    <h2 className="text-sm text-slate-500">{inst.hour_instalation}</h2>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-slate-500 text-sm gap-1.5 mb-4">
                                                <MapPin className="w-4 h-4" />
                                                {inst.address}
                                            </div>

                                            {/* Botones de acción dentro de la tarjeta */}
                                            <div className="flex gap-3">
                                                {inst.status !== 'completed' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                                                        onClick={() => markAsCompleted(inst)}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Marcar Lista
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                                    onClick={() => deleteInstallation(inst.id_instal)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-slate-200 hover:bg-slate-50"
                                                // Aquí podrías agregar una función para mostrar más detalles de la instalación
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

                    {/* Panel 2: Resumen Mensual (Estilo oscuro) */}
                    <Card className="bg-[#0b1021] text-white rounded-2xl border-none shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white">Resumen Mensual</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-slate-400 text-sm">Total Programadas</span>
                                <span className="text-3xl font-bold">{totalProgramadas}</span>
                            </div>

                            {/* Barra de progreso construida con divs */}
                            <div className="h-2 w-full bg-slate-800 rounded-full mb-6 overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>

                            <div className="flex justify-between border-t border-slate-800 pt-4">
                                <div>
                                    <div className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Listas</div>
                                    <div className="text-2xl font-bold text-green-400">{totalListas}</div>
                                </div>
                                <div className="text-slate-800 w-px h-10 border-r border-slate-800" />
                                <div>
                                    <div className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Faltan</div>
                                    <div className="text-2xl font-bold text-blue-400">{totalFaltan}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {
                        //* COD: KO12
                        isOpenDelete && (
                            <AlertDeleteInstalation
                                onConfirm={() => {
                                    deleteInstallation(selectedInstal?.id_instal || '')
                                    setIsOpenDelete(false)
                                }}
                                onCancel={() => setIsOpenDelete(false)}
                                data={selectedInstal!}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}