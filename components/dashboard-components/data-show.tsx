"use client"

import React, {useEffect, useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts'
import {
    Users, DollarSign, Clock, CheckCircle2,
    Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import totalClients from '@/app/dashboard/actions/total-clients'
import { isToday } from 'date-fns'
import totalAmountMonths from '@/app/dashboard/actions/total-amount'


// --- DATOS FICTICIOS PARA LAS GRÁFICAS ---
const dataBar = [
    { name: 'Lun', ingresos: 1200 },
    { name: 'Mar', ingresos: 1900 },
    { name: 'Mie', ingresos: 1500 },
    { name: 'Jue', ingresos: 2200 },
    { name: 'Vie', ingresos: 3000 },
    { name: 'Sab', ingresos: 2500 },
    { name: 'Dom', ingresos: 1100 },
]


const dataPie = [
    { name: 'Completadas', value: 65, color: '#10b981' }, // Verde
    { name: 'Pendientes', value: 25, color: '#3b82f6' },  // Azul
    { name: 'Canceladas', value: 10, color: '#ef4444' },  // Rojo
]



export default function DataShowComponent() {
    const [usersTotal, setUserTotal] = useState(0);
    const [amountTotal, setAmountTotal] = useState(0);

    useEffect(() => {
        // Función para obtener los datos desde la base de datos y utilizarlos en las funciones
        const fetchData = async () => {
            try {
                const resUsers = await totalClients();
                const resAmount = await totalAmountMonths();
                setUserTotal(Number(resUsers.data));
                setAmountTotal(Number(resAmount));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                throw new Error("Error fetching total clients: ");
            }
        }
        fetchData();
    }, [])

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
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-sm font-medium">
                                <ArrowDownRight className="h-4 w-4" />
                                -2 hoy
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Instalaciones Hoy</p>
                            <h2 className="text-3xl font-bold text-slate-900 mt-1">12</h2>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 4 */}
                <Card className="shadow-sm border-slate-100">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-purple-50 text-purple-500 rounded-lg">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-sm font-medium">
                                <ArrowUpRight className="h-4 w-4" />
                                Meta
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Completadas</p>
                            <h2 className="text-3xl font-bold text-slate-900 mt-1">98.2%</h2>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* CHARTS SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Bar Chart (Ocupa 2/3 del espacio) */}
                <Card className="lg:col-span-2 shadow-sm border-slate-100">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg text-slate-900 font-bold">Rendimiento de Ganancias</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Ingresos proyectados vs reales por semana</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                                <span className="h-2 w-2 rounded-full bg-blue-600"></span> Ingresos
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataBar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="ingresos" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Donut Chart (Ocupa 1/3 del espacio) */}
                <Card className="shadow-sm border-slate-100">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-900 font-bold">Estado de Tareas</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">Balance de instalaciones activas</p>
                    </CardHeader>
                    <CardContent>
                        {/* Gráfico Donut */}
                        <div className="h-[200px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataPie}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {dataPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Leyenda de la gráfica de pastel */}
                        <div className="mt-6 space-y-3">
                            {dataPie.map((item, index) => {
                                return (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{ backgroundColor: item.color }} />
                                            <span className="text-slate-600">{item.name}</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">{item.value}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">Comentarios</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}       
