"use client"
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ClientPaymentInfo } from "../models/client-model";
import { DataClientPaymentInfo } from "../actions/read-client-data-action";

import ShowPayments from "./show-payments";
import { readPaymentsAction } from "../actions/read-payments-action";
import { Payment } from "../models/payment-model";
import deleteDialogPaymentAction from "../actions/payment-delete-action";
import { getMonthsDue, getPlanStatus } from "../actions/status-plan-action";
import { DialogPayment } from "./dialog-payment";

// Normaliza una fecha (string o Date) a un string 'YYYY-MM-DD'
const normalizeDateStr = (d: string | Date): string => {
    // Crea un objeto Date, manejando strings o Dates
    const date = typeof d === 'string' ? new Date(d) : d;
    // Usa los componentes de la fecha en UTC para evitar problemas de zona horaria
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Limpia y normaliza la lista de meses pagados
const normalizePaidMonths = (list?: (string | string[])[]): string[] => {
    if (!list) return [];
    const flatAndNormalized = list.flat().map(normalizeDateStr);
    return Array.from(new Set(flatAndNormalized));
};

export default function PaymentPageClient() {
    const [clientInfo, setClientInfo] = useState<ClientPaymentInfo[]>([]);
    const [open, setOpen] = useState(false);
    const [showPaymentsOpen, setShowPaymentsOpen] = useState(false);
    const [selectedPayments, setSelectedPayments] = useState<Payment[]>([]);
    const [selectedCliente, setSelectedCliente] = useState<ClientPaymentInfo | undefined>();

    // Carga inicial de datos
    useEffect(() => {
        const fetchData = async () => {
            const rawData = await DataClientPaymentInfo({ from: 0, to: 100 });
            const processedData = rawData.map(client => {
                // Usamos la función para limpiar los datos que vienen de la BD
                const safePaidMonths = normalizePaidMonths(client.paidMonths);
                const dueMonths = getMonthsDue(client.paymentDate, safePaidMonths);
                const planStatus = getPlanStatus(dueMonths);
                return {
                    ...client,
                    paidMonths: safePaidMonths,
                    monthsDue: dueMonths,
                    planStatus
                };
            });
            setClientInfo(processedData);
        };
        fetchData();
    }, []);


    const handleOpenDialog = (client: ClientPaymentInfo) => {
        setSelectedCliente(client);
        setOpen(true);
    };

    const handleShowPayments = async (cliente: ClientPaymentInfo) => {
        const payments = await readPaymentsAction(cliente.id_client);
        setSelectedCliente(cliente);
        setSelectedPayments(payments);
        setShowPaymentsOpen(true);
    };

    const handleClosePayments = () => {
        setShowPaymentsOpen(false);
        setSelectedPayments([]);
        setSelectedCliente(undefined);
    };

    const handleDeletePayment = async (payment: Payment) => {
        await deleteDialogPaymentAction(payment.id_payments);
        setSelectedPayments(prev =>
            prev.filter(p => p.id_payments !== payment.id_payments)
        );
    };


    const handlePaySuccess = useCallback(async (client: ClientPaymentInfo, monthDate: string) => {
        console.log(`Pago registrado localmente: ${monthDate}`);
        const normalizedMonth = normalizeDateStr(monthDate);

        // 1. Actualizamos la lista general de clientes (Tabla)
        setClientInfo(prevClients => prevClients.map(c => {
            if (c.id_client === client.id_client) {
                // Usamos la función para asegurar una lista limpia y sin duplicados
                const newPaidMonths = normalizePaidMonths([...(c.paidMonths || []), normalizedMonth]);
                const newDueMonths = getMonthsDue(c.paymentDate, newPaidMonths);
                const newStatus = getPlanStatus(newDueMonths);
                
                console.log("Actualizando cliente pagado:", {
                    paidMonths: newPaidMonths,
                    monthsDue: newDueMonths,
                    planStatus: newStatus
                });

                return {
                    ...c,
                    paidMonths: newPaidMonths,
                    monthsDue: newDueMonths,
                    planStatus: newStatus
                };
            }
            return c;
        }));

        // 2. Actualizamos el cliente seleccionado (Dialog)
        setSelectedCliente(prevSelected => {
            if (!prevSelected || prevSelected.id_client !== client.id_client) return prevSelected;
            const newPaidMonths = normalizePaidMonths([...(prevSelected.paidMonths || []), normalizedMonth]);
            const newDueMonths = getMonthsDue(prevSelected.paymentDate, newPaidMonths);
            const newStatus = getPlanStatus(newDueMonths);
            return {
                ...prevSelected,
                paidMonths: newPaidMonths,
                monthsDue: newDueMonths,
                planStatus: newStatus
            };
        });

    }, []);

    return (
        <div className="mt-8 w-full p-2 mx-auto">
            <Card className="shadow-xl border border-primary-100">
                <CardHeader className="bg-primary-50 rounded-t-xl shadow-sm">
                    <CardTitle className="text-2xl text-primary-700">Editar Cliente</CardTitle>
                    <CardDescription className="text-primary-500">
                        Gestión de pagos y estados.
                    </CardDescription>
                    <CardAction>
                        <Button variant="ghost" className="text-primary-700 hover:bg-primary-100">
                            Total Clientes: {clientInfo.length}
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="overflow-x-auto p-0">
                    <div className="max-h-[60vh] overflow-y-auto">
                        <Table className="rounded-xl bg-white shadow-lg border border-primary-100">
                            <TableHeader className="bg-primary-100 sticky top-0 z-10">
                                <TableRow>
                                    <TableHead className="text-primary-700 font-bold">Nombre</TableHead>
                                    <TableHead className="text-primary-700 font-bold">Antena</TableHead>
                                    <TableHead className="text-primary-700 font-bold">Plan</TableHead>
                                    <TableHead className="text-primary-700 font-bold">Instalación</TableHead>
                                    <TableHead className="text-primary-700 font-bold">Estado</TableHead>
                                    <TableHead className="text-primary-700 font-bold text-center">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clientInfo.map((cliente) => (
                                    <TableRow key={cliente.id_client} className="hover:bg-primary-50">
                                        <TableCell>{cliente.name} {cliente.lastname}</TableCell>
                                        <TableCell>{cliente.antennaName}</TableCell>
                                        <TableCell>$ {cliente.plan}</TableCell>
                                        <TableCell>
                                            {new Date(cliente.paymentDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cliente.planStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {cliente.planStatus === 'paid' ? 'Al día' : `Debe ${cliente.monthsDue.length ? cliente.monthsDue.length : 0} mes(es)`}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center flex justify-center gap-2">
                                            <Button
                                                onClick={() => handleOpenDialog(cliente)}
                                                size="sm"
                                                className="bg-primary-600 text-red hover:bg-primary-700"
                                            >
                                                <Check className="w-4 h-4 mr-1" /> Pagar
                                            </Button>
                                            <Button
                                                onClick={() => handleShowPayments(cliente)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Eye className="w-4 h-4 mr-1" /> Ver
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {open && selectedCliente && (
                <DialogPayment
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onPaySuccess={handlePaySuccess}
                    data={selectedCliente}
                />
            )}

            {showPaymentsOpen && selectedCliente && (
                <ShowPayments
                    isOpen={showPaymentsOpen}
                    onClose={handleClosePayments}
                    onDeletePayment={handleDeletePayment}
                    data={{ ...selectedCliente, payments: selectedPayments }}
                />
            )}
        </div>
    );
}
