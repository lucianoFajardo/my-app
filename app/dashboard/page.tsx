import DataShowComponent from '@/components/dashboard-components/data-show'
import React from 'react'

export default function page() {
    return (
        <div className='p-6 md:p-8 max-w-7xl mx-auto space-y-5 bg-slate-50 min-h-screen'>
            <DataShowComponent />
        </div>
    )
}

/** comentarios agregarlos aqui */
// seguir aqui , agregar todo el apartado visual luego agregar el apartado logico 
// optimizar lo maximo posible las llamadas a la base de datos y el rendimiento del dashboard

