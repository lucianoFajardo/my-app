
import { AlertCircle, AlertTriangle, User, Wifi } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { pendingPaymentModel } from "@/app/dashboard/model/pending-payment-model";
import Link from "next/link";

interface showOutstandingPaymentsProps {
    props: pendingPaymentModel[];
}

export function showOutstandingPayments({ props }: showOutstandingPaymentsProps) {
    return <Card className="lg:col-span-2 shadow-sm border-red-100 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-red-50/50 pb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-md shadow-sm">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                    <CardTitle className="text-lg font-bold text-red-900">Pagos Pendientes / Vencidos</CardTitle>
                    <CardDescription className="text-red-700/80">Clientes que se encuentran con pagos pendientes o vencidos.</CardDescription>
                    <CardDescription className="text-red-700/80 text-sm">{props.length} clientes con pagos pendientes o vencidos.</CardDescription>
                </div>
            </div>
            <Link href="/pages/clientes/payment" className="border-red-200 text-red-700 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium">
                Ver pagos pendientes
            </Link>

        </CardHeader>
        <CardContent className="p-0 bg-white">
            <div className="max-h-[350px] overflow-y-auto">
                <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 backdrop-blur-sm z-10 shadow-sm">
                        <TableRow>
                            <TableHead className="w-[200px] font-semibold text-slate-700">Cliente</TableHead>
                            <TableHead className="font-semibold text-slate-700">Antena</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.map((debtor) => (
                            <TableRow key={debtor.id_client} className="hover:bg-red-50/30">
                                <TableCell className="font-medium text-slate-900">
                                    <div className="flex items-center gap-2.5">
                                        <div className="bg-slate-100 p-1.5 rounded-full text-slate-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        {debtor.client}
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Wifi className="w-3.5 h-3.5 text-slate-400" />
                                        {debtor.antenna_name}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold 
                                                        ${debtor.status_pay_client === 'AL DÍA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {/* {debtor.covered_up_to > 10 ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />} */}
                                        {debtor.covered_up_to ? <p className='text-red-700'>Vencido</p> : <p className='text-green-700'>Al día</p>}
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}
                        {props.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                    <AlertCircle className="mx-auto mb-2 w-6 h-6 text-slate-500" />
                                    No hay pagos vencidos actualmente.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
}