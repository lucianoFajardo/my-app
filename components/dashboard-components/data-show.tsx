"use client"
import React, { useEffect, useState } from 'react'
import {
    Users, DollarSign, Clock,
    Calendar, ArrowUpRight,
    X, AlertTriangle, ArrowDownRight,
    User, Wifi, AlertCircle, CreditCard, CalendarDays, MapPin, Router as RouterIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { isToday } from 'date-fns'
import { useRouter } from 'next/navigation'
import totalInstallationsAction from '@/app/dashboard/actions/total-installations'
import totalAmountMonthsAction from '@/app/dashboard/actions/total-amount'
import totalClientsAction from '@/app/dashboard/actions/total-clients'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { getPendingPaymentsAction } from '@/app/dashboard/actions/pending-payments-action'


// --- DATOS FICTICIOS PARA LAS GRÁFICAS ---
const debtorsData = [
    { id: 1, name: 'Juan Pérez', plan: 'Plan 50MB', amount: 1500, daysLate: 5 },
    { id: 2, name: 'María Gómez', plan: 'Plan 100MB', amount: 2200, daysLate: 12 },
    { id: 3, name: 'Carlos López', plan: 'Plan 50MB', amount: 1500, daysLate: 3 },
    { id: 4, name: 'Ana Silva', plan: 'Plan 200MB', amount: 3500, daysLate: 20 },
    { id: 5, name: 'Pedro Martínez', plan: 'Plan 50MB', amount: 1500, daysLate: 2 },
]
// Agrega esto debajo de debtorsData y borra dataPie
const pendingRemovalsData = [
    { id: 101, name: 'Roberto Díaz', zone: 'Centro', dateRequest: '12/05/2026', equipment: 'Antena + Router' },
    { id: 102, name: 'Laura Vargas', zone: 'Norte', dateRequest: '10/05/2026', equipment: 'Solo Antena' },
    { id: 103, name: 'Mario Silva', zone: 'Sur', dateRequest: '14/05/2026', equipment: 'Router' },
]


// TODO -< creamos fn en el backend para obtner valores y optimizar el rendimiento del dashboard


export default function DataShowComponent() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [usersTotal, setUserTotal] = useState(0);
    const [installationsToday, setInstallationsToday] = useState(0);
    const [amountTotal, setAmountTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        // getPendingPaymentsAction()
        const fetchData = async () => {
            try {
                const [resUsers, resAmount, resInstall] = await Promise.all([
                    totalClientsAction(),
                    totalAmountMonthsAction(),
                    totalInstallationsAction()
                ]);
                setUserTotal(Number(resUsers?.data ?? resUsers));
                setAmountTotal(Number(resAmount ?? 0));
                setInstallationsToday(Number(resInstall));
                setLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                setLoading(false);
                throw new Error("Error fetching total clients: ");
            }
        }
        fetchData();
    }, []);

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
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
            <Card className="bg-white rounded-xl shadow-sm border-border overflow-hidden">
                <div className="bg-slate-50/50 border-b px-6 py-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard General</h1>
                        <p className="text-slate-500 mt-1">Control de instalaciones y rendimiento operativo.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button disabled variant="outline" className="bg-white">
                            <Calendar className="mr-2 h-4 w-4" />
                            {isToday(new Date()) ? new Date().toLocaleDateString() : "--/--/----"}
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => router.push('/pages/scheduler/instalation/form')}>
                            Registrar Instalación
                        </Button>
                    </div>
                </div>

                <CardContent className="p-6 md:p-8 space-y-8 bg-slate-50/30">
                    {/* KPI CARDS (4 Columnas) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1 */}
                        <Card className="shadow-sm border-blue-100 bg-blue-50/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700">Clientes Instalados</CardTitle>
                                <div className="p-2 bg-blue-100 rounded-md">
                                    <Users className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{usersTotal}</div>
                                <p className="text-xs text-blue-600 flex items-center mt-1 font-medium">
                                    <ArrowUpRight className="mr-1 h-3 w-3" />
                                    {/* +2 este mes */}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card 2 */}
                        <Card className="shadow-sm border-emerald-100 bg-emerald-50/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700">Ganancias del Mes</CardTitle>
                                <div className="p-2 bg-emerald-100 rounded-md">
                                    <DollarSign className="h-4 w-4 text-emerald-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">${amountTotal.toLocaleString()}</div>
                                <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                                    <ArrowUpRight className="mr-1 h-3 w-3" />
                                    {/* +15.3% respecto al pasado */}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card 3 */}
                        <Card className="shadow-sm border-indigo-100 bg-indigo-50/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700">Instalaciones Hoy</CardTitle>
                                <div className="p-2 bg-indigo-100 rounded-md">
                                    <Clock className="h-4 w-4 text-indigo-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{installationsToday}</div>
                                <p className="text-xs text-indigo-600 flex items-center mt-1 font-medium">
                                    {/* Programadas para hoy */}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card 4 */}
                        <Card className="shadow-sm border-red-100 bg-red-50/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700">Retiros Pendientes</CardTitle>
                                <div className="p-2 bg-red-100 rounded-md">
                                    <X className="h-4 w-4 text-red-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{pendingRemovalsData.length}</div>
                                <p className="text-xs text-red-600 flex items-center mt-1 font-medium">
                                    <ArrowDownRight className="mr-1 h-3 w-3" />
                                    {/* Requieren atención */}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CHARTS SECTIONS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tabla de Deudores */}
                        <Card className="lg:col-span-2 shadow-sm border-red-100 overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b bg-red-50/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-md shadow-sm">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-red-900">Pagos Pendientes / Vencidos</CardTitle>
                                        <CardDescription className="text-red-700/80">Clientes que se encuentran con pagos pendientes o vencidos.</CardDescription>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100" onClick={() => router.push('/dashboard/finanzas')}>
                                    Ver todos
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 bg-white">
                                <div className="max-h-[350px] overflow-y-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50 sticky top-0 backdrop-blur-sm z-10 shadow-sm">
                                            <TableRow>
                                                <TableHead className="w-[200px] font-semibold text-slate-700">Cliente</TableHead>
                                                <TableHead className="font-semibold text-slate-700">Plan</TableHead>
                                                <TableHead className="font-semibold text-slate-700 text-center">Estado</TableHead>
                                                <TableHead className="text-right font-semibold text-slate-700">Deuda</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {debtorsData.map((debtor) => (
                                                <TableRow key={debtor.id} className="hover:bg-red-50/30">
                                                    <TableCell className="font-medium text-slate-900">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="bg-slate-100 p-1.5 rounded-full text-slate-500">
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                            {debtor.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600 text-sm">
                                                        <div className="flex items-center gap-1.5">
                                                            <Wifi className="w-3.5 h-3.5 text-slate-400" />
                                                            {debtor.plan}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {/* Simulación de un 'Badge' de Shadcn UI */}
                                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${debtor.daysLate > 10
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-amber-100 text-amber-800'
                                                            }`}>
                                                            {debtor.daysLate > 10 ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                            {debtor.daysLate} días
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-slate-700">
                                                        <div className="flex items-center justify-end gap-1.5 text-red-600">
                                                            <CreditCard className="w-4 h-4 text-red-400" />
                                                            ${debtor.amount.toLocaleString()}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {/* Opcional: Si no hay deudores */}
                                            {debtorsData.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                                        No hay pagos vencidos actualmente.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lista de Retiros Pendientes (Ocupa 1/3 del espacio) */}
                        <Card className="shadow-sm flex flex-col h-full relative border-amber-100 overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b bg-amber-50/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-md shadow-sm">
                                        <X className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-amber-900">Retiros Pendientes</CardTitle>
                                        <CardDescription className="text-amber-700/80">Equipos listos para desinstalar</CardDescription>
                                    </div>
                                </div>
                                <div className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm border border-amber-200">
                                    {pendingRemovalsData.length}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 bg-white">
                                <div className="max-h-[350px] overflow-y-auto overflow-x-hidden divide-y divide-slate-100">
                                    {pendingRemovalsData.map((removal) => (
                                        <div key={removal.id} className="p-4 hover:bg-amber-50/40 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-amber-100 p-1.5 rounded-full text-amber-600">
                                                        <User className="w-3.5 h-3.5" />
                                                    </div>
                                                    <p className="font-bold text-slate-900 text-sm truncate pr-2" title={removal.name}>
                                                        {removal.name}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded whitespace-nowrap border border-amber-100 flex items-center gap-1.5">
                                                    <CalendarDays className="w-3 h-3" />
                                                    {removal.dateRequest}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 mb-3">
                                                <div className="flex items-center text-xs text-slate-600 truncate pr-2 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                    <MapPin className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
                                                    <span className="truncate">{removal.zone}</span>
                                                </div>
                                                <div className="flex items-center text-xs font-medium text-slate-600 truncate bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                    <RouterIcon className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                                                    {removal.equipment}
                                                </div>
                                            </div>

                                            {/* Controles */}
                                            <div className="grid grid-cols-2 gap-2 mt-3 w-full">
                                                {/* Botón Ver Detalles */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-[11px] w-full border-slate-200 text-slate-600 hover:text-slate-900"
                                                    onClick={() => console.log('Ver detalles de', removal.id)}
                                                >
                                                    Ver Detalles
                                                </Button>
                                                {/* Botón Actualizar a Retirado */}
                                                <Button
                                                    size="sm"
                                                    className="h-8 text-[11px] w-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-sm"
                                                    onClick={() => console.log('Marcar como retirado a', removal.id)}
                                                >
                                                    Retirado
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingRemovalsData.length === 0 && (
                                        <div className="p-8 text-center text-slate-500 text-sm font-medium">
                                            ¡Excelente! No hay retiros pendientes.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}       
