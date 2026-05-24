"use client"
import React, { useEffect, useState } from 'react'
import {
    Users, DollarSign, Clock,
    Calendar, ArrowUpRight,
    X, AlertTriangle, ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { isToday } from 'date-fns'
import { useRouter } from 'next/navigation'
import totalInstallationsAction from '@/app/dashboard/actions/total-installations'
import totalAmountMonthsAction from '@/app/dashboard/actions/total-amount'
import totalClientsAction from '@/app/dashboard/actions/total-clients'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'


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

const dataPie = [
    { name: 'Completadas', value: 65, color: '#10b981' }, // Verde
    { name: 'Pendientes', value: 25, color: '#3b82f6' },  // Azul
    { name: 'Canceladas', value: 10, color: '#ef4444' },  // Rojo
]

// TODO -< creamos fn en el backend para obtner valores y optimizar el rendimiento del dashboard


export default function DataShowComponent() {
    const router = useRouter();
    const [usersTotal, setUserTotal] = useState(0);
    const [installationsToday, setInstallationsToday] = useState(0);
    const [amountTotal, setAmountTotal] = useState(0);

    useEffect(() => {
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
                console.log("Users:", resUsers, "Amount:", resAmount, "Install:", resInstall);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                throw new Error("Error fetching total clients: ");
            }
        }
        fetchData();
    }, []);


    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-5 bg-slate-50 min-h-screen">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard General</h1>
                    <p className="text-slate-500 mt-1">Control de instalaciones y rendimiento operativo.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button disabled variant="outline" className="text-slate-600 bg-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        {isToday(new Date()) ? new Date().toLocaleDateString() : "--/--/----"}
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push('/pages/scheduler/instalation/form')}>
                        Registrar Instalación
                    </Button>
                </div>
            </div>

            {/* KPI CARDS (4 Columnas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <Card className="shadow-sm border-slate-100">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
                                <Users className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-sm font-medium">
                                {/* Indicador de crecimiento aqui crear una formula para poder trabajar con este apartado*/}
                                <ArrowUpRight className="h-4 w-4" />
                                clientes
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Clientes Instalados</p>
                            <h2 className="text-3xl font-bold text-slate-900 mt-1">{usersTotal ?? 'Cargando...' ? usersTotal : 'Datos no disponibles'}</h2>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2 */}
                <Card className="shadow-sm border-slate-100">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-sm font-medium">
                                {/* Indicador de crecimiento aqui crear una formula para poder trabajar con este apartado*/}
                                <ArrowUpRight className="h-4 w-4" />
                                +15.3%
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Ganancias Mes {new Date().toLocaleString('default', { month: 'long' })}</p>
                            <h2 className="text-3xl font-bold text-slate-900 mt-1">{amountTotal ?? 'Cargando...' ? `$${amountTotal}` : 'Datos no disponibles'}</h2>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3 */}
                <Card className="shadow-sm border-slate-100">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
                                <Clock className="h-6 w-6" />
                            </div>
                            {/* <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-sm font-medium">
                                <ArrowDownRight className="h-4 w-4" />
                                -2 hoy
                            </div> */}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Instalaciones Hoy</p>
                            <h2 className="text-3xl font-bold text-slate-900 mt-1">{installationsToday ?? 'Cargando...' ? installationsToday : 'Ninguna instalación'}</h2>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 4 */}
                <Card className="shadow-sm border-red-400 bg-red-100">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                                <X className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-sm font-medium">
                                <ArrowUpRight className="h-4 w-4" />
                                Totales
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-red-400 uppercase tracking-wider">Retiros</p>
                            <h2 className="text-3xl font-bold text-red-900 mt-1">98.2%</h2>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* CHARTS SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart (Ocupa 2/3 del espacio) */}
                {/* Tabla de Deudores (Ocupa 2/3 del espacio) */}
                <Card className="lg:col-span-2 shadow-sm border-red-200 bg-red-50">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg text-red-600 font-bold flex items-center gap-2">
                                    <X className="w-5 h-5" /> Pagos Pendientes / Vencidos
                                </CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Clientes que se encuentran con pagos pendientes o vencidos.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/finanzas')}>
                                Ver todos
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* En lugar de ResponsiveContainer, ponemos un div con scroll para la tabla */}
                        <div className="mt-2 rounded-md border border-red-200 bg-red-50">
                            <Table>
                                <TableHeader className="bg-red-50/80">
                                    <TableRow>
                                        <TableHead className="w-[200px] font-semibold text-black-700">Cliente</TableHead>
                                        <TableHead className="font-semibold text-black-700">Plan</TableHead>
                                        <TableHead className="font-semibold text-black-700 text-center">Estado</TableHead>
                                        <TableHead className="text-right font-semibold text-black-700">Deuda</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {debtorsData.map((debtor) => (
                                        <TableRow key={debtor.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium text-slate-900">
                                                {debtor.name}
                                            </TableCell>
                                            <TableCell className="text-black-700 text-sm">
                                                {debtor.plan}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {/* Simulación de un 'Badge' de Shadcn UI */}
                                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${debtor.daysLate > 10
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {debtor.daysLate} días vencido
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-slate-700">
                                                ${debtor.amount.toLocaleString()}
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

                {/* Donut Chart (Ocupa 1/3 del espacio) */}
                {/* Lista de Retiros Pendientes (Ocupa 1/3 del espacio) */}
                {/* Lista de Retiros Pendientes (Ocupa 1/3 del espacio) */}
                <Card className="shadow-sm border-amber-300 bg-amber-50 flex flex-col h-full relative overflow-hidden">
                    {/* Borde superior decorativo más fuerte */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>

                    <CardHeader className="pb-3 border-b border-amber-200">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                <div>
                                    <CardTitle className="text-lg text-amber-900 font-bold">Retiros Pendientes</CardTitle>
                                    <p className="text-sm text-amber-700 mt-1">Equipos listos para desinstalar</p>
                                </div>
                            </div>
                            <div className="bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                {pendingRemovalsData.length}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        {/* 1. AGREGAMOS overflow-x-hidden para matar el scroll horizontal */}
                        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden divide-y divide-amber-200/60">
                            {pendingRemovalsData.map((removal) => (
                                <div key={removal.id} className="p-4 hover:bg-amber-100/50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-amber-900 text-sm truncate pr-2" title={removal.name}>
                                            {removal.name}
                                        </p>
                                        <span className="text-[10px] text-amber-800 font-bold bg-amber-200/50 px-2 py-0.5 rounded whitespace-nowrap">
                                            {removal.dateRequest}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 mb-3">
                                        <div className="flex items-center text-xs text-amber-700 truncate pr-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse shrink-0"></span>
                                            <span className="truncate">{removal.zone}</span>
                                        </div>
                                        <p className="text-xs font-semibold text-amber-800 truncate pl-2">{removal.equipment}</p>
                                    </div>

                                    {/* 2. CAMBIAMOS EL FLEX POR UN GRID: Esto obliga a no salirse de la caja */}
                                    <div className="grid grid-cols-2 gap-2 mt-3 w-full">
                                        {/* Botón Ver Detalles */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-[11px] w-full bg-white border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800 px-1"
                                            onClick={() => console.log('Ver detalles de', removal.id)}
                                        >
                                            Ver Detalles
                                        </Button>
                                        {/* Botón Actualizar a Retirado */}
                                        <Button
                                            size="sm"
                                            className="h-8 text-[11px] w-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shadow-sm px-1"
                                            onClick={() => console.log('Marcar como retirado a', removal.id)}
                                        >
                                            Retirado
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {pendingRemovalsData.length === 0 && (
                                <div className="p-8 text-center text-amber-600 text-sm font-medium">
                                    ¡Excelente! No hay retiros pendientes.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                {/* <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">Comentarios</CardTitle>
                    </CardHeader>
                </Card> */}
            </div>
        </div>
    )
}       
