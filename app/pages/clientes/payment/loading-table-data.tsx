'use client'

import { TableCell, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

export default function LoadingTableData() {
    return (
        <TableRow>
            <TableCell colSpan={6} className="px-6 py-16 text-center">
                <div className="mx-auto max-w-md space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-base font-medium">No hay resultados para esa búsqueda</p>
                    <p className="text-sm text-muted-foreground">
                        Intenta con otro nombre o limpia el filtro para ver todos los clientes.
                    </p>
                </div>
            </TableCell>
        </TableRow>
    )


}