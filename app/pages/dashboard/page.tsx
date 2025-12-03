"use client"

import {
    Users,
    TrendingUp,
    DollarSign,
    Eye,
} from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="p-8 bg-blue-50 m-5 w-full min-w-0 flex-1 rounded-2xl">
            <div className="space-y-8 w-full">
                {/* Welcome Section */}
                <div className="from-primary-600 via-primary-500 to-celeste text-red rounded-2xl p-8 shadow-xl w-full">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
                            <p className="text-primary-100 mb-4">Aquí tienes un resumen de tu actividad reciente</p>
                            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                                Ver Reportes
                            </button>
                        </div>
                        <div className="mt-6 md:mt-0 text-right">
                            <p className="text-primary-200 text-sm">Última actualización</p>
                            <p className="text-lg font-semibold">Hoy, 2:30 PM</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
                    {/* ...existing code... */}
                    {/* Card 1 */}
                    <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-primary-200 hover:shadow-xl hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-primary-600 text-sm font-medium mb-1">Total Usuarios</p>
                                <p className="text-3xl font-bold text-primary-800 mb-2">2,847</p>
                                <p className="text-green-500 text-sm font-medium">↗ +12% este mes</p>
                            </div>
                            <div className="bg-primary-100 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-8 w-8 text-primary-600" />
                            </div>
                        </div>
                        <div className="mt-4 h-1 bg-primary-100 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-primary-800 to-primary-800 rounded-full w-3/4 transition-all duration-1000"></div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-primary-200 hover:shadow-xl hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-primary-600 text-sm font-medium mb-1">Ingresos Totales</p>
                                <p className="text-3xl font-bold text-primary-800 mb-2">$45,231</p>
                                <p className="text-green-500 text-sm font-medium">↗ +8.2% este mes</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 h-1 bg-primary-100 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-green-400 to-green-600 rounded-full w-4/5 transition-all duration-1000"></div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-primary-200 hover:shadow-xl hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-primary-600 text-sm font-medium mb-1">Tasa Conversión</p>
                                <p className="text-3xl font-bold text-primary-800 mb-2">24.7%</p>
                                <p className="text-green-500 text-sm font-medium">↗ +2.1% este mes</p>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 h-1 bg-primary-100 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full w-1/4 transition-all duration-1000" ></div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-primary-200 hover:shadow-xl hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-primary-600 text-sm font-medium mb-1">Vistas Página</p>
                                <p className="text-3xl font-bold text-primary-800 mb-2">892,147</p>
                                <p className="text-red-500 text-sm font-medium">↘ -3.2% este mes</p>
                            </div>
                            <div className="bg-purple-100 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <Eye className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 h-1 bg-primary-100 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-purple-400 to-purple-600 rounded-full w-full transition-all duration-1000"></div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {/* ...existing code... */}
                    {/* Revenue Chart */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-primary-200">
                        <h3 className="text-lg font-semibold text-primary-800 mb-6">Ingresos Mensuales</h3>
                        <div className="h-64 flex items-end justify-between space-x-2">
                            {[65, 78, 52, 82, 45, 91].map((height, index) => (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <div
                                        className="w-full rounded-t-lg transition-all duration-500 hover:opacity-10 bg-red-800"
                                        style={{ height: `${height}%`, minHeight: '20px' }}
                                    >

                                    </div>
                                    <span className="text-xs text-primary-600 mt-2">
                                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Chart */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-primary-200">
                        <h3 className="text-lg font-semibold text-primary-800 mb-6">Actividad Semanal</h3>
                        <div className="h-64 relative">
                            <svg className="w-full h-full" viewBox="0 0 400 200">
                                <polyline
                                    points="50,150 100,120 150,80 200,90 250,60 300,70 350,50"
                                    fill="none"
                                    stroke="rgb(var(--primary-500))"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {[150, 120, 80, 90, 60, 70, 50].map((y, index) => (
                                    <circle
                                        key={index}
                                        cx={50 + index * 50}
                                        cy={y}
                                        r="4"
                                        fill="rgb(var(--primary-600))"
                                        className="hover:r-6 transition-all duration-200"
                                    />
                                ))}
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Recent Activity & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                    {/* ...existing code... */}
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-primary-200">
                        <h3 className="text-lg font-semibold text-primary-800 mb-6">Actividad Reciente</h3>
                        <div className="space-y-4">
                            {[
                                { action: "Nuevo usuario registrado", user: "María González", time: "hace 5 min", color: "bg-primary-500" },
                                { action: "Venta completada", user: "Pedido #1234 por $299.99", time: "hace 12 min", color: "bg-green-500" },
                                { action: "Reporte generado", user: "Informe mensual de ventas", time: "hace 1 hora", color: "bg-blue-500" },
                                { action: "Sistema actualizado", user: "Versión 2.1.0 instalada", time: "hace 2 horas", color: "bg-orange-500" },
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-primary-50 transition-colors">
                                    <div className={`w-3 h-3 ${item.color} rounded-full mt-1.5 shrink-0`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-primary-800 font-medium">{item.action}</p>
                                        <p className="text-primary-600 text-sm truncate">{item.user}</p>
                                        <p className="text-primary-500 text-xs">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-primary-200">
                        <h3 className="text-lg font-semibold text-primary-800 mb-6">Métricas Rápidas</h3>
                        <div className="space-y-6">
                            {/* Progress Metric */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-primary-600 text-sm">Meta Mensual</span>
                                    <span className="text-primary-800 font-semibold">75%</span>
                                </div>
                                <div className="w-full bg-primary-100 rounded-full h-2">
                                    <div className="bg-linear-to-r from-primary-400 to-primary-600 h-2 rounded-full w-3/4"></div>
                                </div>
                            </div>

                            {/* Circular Progress */}
                            <div className="text-center">
                                <div className="relative w-20 h-20 mx-auto mb-3">
                                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="rgb(var(--primary-200))"
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="rgb(var(--primary-500))"
                                            strokeWidth="3"
                                            strokeDasharray="85, 100"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-primary-800">85%</span>
                                    </div>
                                </div>
                                <p className="text-primary-600 text-sm">Satisfacción Cliente</p>
                            </div>

                            {/* Mini Stats */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-primary-600 text-sm">Bounce Rate</span>
                                    <span className="text-red-500 font-semibold">25%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-primary-600 text-sm">Avg. Session</span>
                                    <span className="text-primary-800 font-semibold">4:32</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-primary-600 text-sm">Pages/Session</span>
                                    <span className="text-primary-800 font-semibold">3.2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}