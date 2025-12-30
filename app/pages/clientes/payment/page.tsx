"use client"
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Check, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ClientPaymentInfo } from "../models/client-model";
import { DataClientPaymentInfo } from "../actions/read-client-data-action";

import ShowPayments from "./show-payments";
import { readPaymentsAction } from "../actions/read-payments-action";
import { Payment } from "../models/payment-model";
import deleteDialogPaymentAction from "../actions/payment-delete-action";
import { getMonthsDue, getPlanStatus } from "../actions/status-plan-action";
import { DialogPayment } from "./dialog-payment";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

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
    // parametros para la busqueda y filtrado de datos
    const [searchParam, setSearchParam] = useState<string | undefined>("");
    // Paginación de la tabla de pagos de clientes
    const [page, setPage] = useState(0);
    const itemsPerPage = 30;

    // Carga inicial de datos
    useEffect(() => {
        const fetchData = async () => {
            const from = page * itemsPerPage;
            const to = from + itemsPerPage - 1;

            const rawData = await DataClientPaymentInfo({ from, to, searchParam });
            const processedData = rawData.map(client => {
                // Usamos la función para limpiar los datos que vienen de la BD
                const safePaidMonths = normalizePaidMonths(client.paidMonths);
                const dueMonths = getMonthsDue(client.initialPayment, safePaidMonths);
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
        // un delay para evitar llamadas excesivas al cambiar de página rápidamente
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [page, searchParam]);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParam(e.target.value);
        setPage(0); // Reiniciar a la primera página al buscar
    }

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

    const handleDeletePayment = async (payment: Payment, clientId: string) => {
        await deleteDialogPaymentAction(payment.id_payments, clientId);
        setSelectedPayments(prev =>
            prev.filter(p => p.id_payments !== payment.id_payments)
        );
    };


    const handlePaySuccess = useCallback(async (client: ClientPaymentInfo, paidMonthDates: string[]) => {
        console.log(`Pago registrado localmente para los meses:`, paidMonthDates);
        // Actualizamos la lista general de clientes (Tabla)
        setClientInfo(prevClients => prevClients.map(c => {
            if (c.id_client === client.id_client) {
                // Unimos los meses que ya estaban pagados con los nuevos que se acaban de pagar
                const combinedPaidMonths = [...(c.paidMonths || []), ...paidMonthDates];
                // Normalizamos la lista para aplanar, formatear y eliminar duplicados
                const newPaidMonths = normalizePaidMonths(combinedPaidMonths);
                const newDueMonths = getMonthsDue(c.initialPayment, newPaidMonths);
                const newStatus = getPlanStatus(newDueMonths);
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

            const combinedPaidMonths = [...(prevSelected.paidMonths || []), ...paidMonthDates];
            const newPaidMonths = normalizePaidMonths(combinedPaidMonths);
            const newDueMonths = getMonthsDue(prevSelected.initialPayment, newPaidMonths);
            const newStatus = getPlanStatus(newDueMonths);
            return {
                ...prevSelected,
                paidMonths: newPaidMonths,
                monthsDue: newDueMonths,
                planStatus: newStatus
            };
        });
    }, []);

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    }

    const handelePreviousPage = () => {
        setPage(page > 0 ? page - 1 : 0)
    }

    return (
        <div className="mt-8 w-full p-2 mx-auto">
            <Card className="shadow-xl border border-primary-100">
                <CardHeader className="bg-primary-50 rounded-t-xl shadow-sm">
                    <CardTitle className="text-2xl text-primary-700">Gestion de Pagos</CardTitle>
                    <CardDescription className="text-primary-500">
                        Gestión de pagos y estados de los clientes.
                    </CardDescription>
                    <CardAction>
                        {/* Agregar filtrado de datos , crear una funcion , setState, un Action que se encarge*/}
                        <div className="relative w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-primary-500" />
                            <Input
                                placeholder="Buscar cliente..."
                                value={searchParam}
                                onChange={handleSearch}
                                className="pl-8 bg-white border-primary-200 focus-visible:ring-primary-500"
                            />
                        </div>
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
                                    <TableHead className="text-primary-700 font-bold">Fechas de pago</TableHead>
                                    <TableHead className="text-primary-700 font-bold">Estado</TableHead>
                                    <TableHead className="text-primary-700 font-bold text-center">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clientInfo.map((cliente) => {
                                    return (
                                        <TableRow key={cliente.id_client} className="hover:bg-primary-50">
                                            <TableCell>{cliente.name} {cliente.lastname}</TableCell>
                                            <TableCell>{cliente.antennaName}</TableCell>
                                            <TableCell>$ {cliente.plan}</TableCell>
                                            <TableCell>
                                                {new Date(cliente.initialPayment).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {cliente.range_payment}
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
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <Separator className="my-5" />
                    <CardFooter >
                        <CardAction>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-primary-700 font-medium">
                                    Página Actual {page + 1}
                                </span>
                                <div className="flex items-center bg-white rounded-md border border-primary-200 shadow-sm m-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handelePreviousPage}
                                        disabled={page === 0}
                                        className="h-8 w-8 rounded-r-none hover:bg-primary-50"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-primary-700" />
                                    </Button>
                                    <div className="w-4 h-4 bg-primary-200"></div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleNextPage}
                                        // Deshabilitar si la respuesta trajo menos datos que el tamaño de página (fin de la lista)
                                        disabled={clientInfo.length < (itemsPerPage * (page + 1))}
                                        className="h-8 w-8 rounded-l-none hover:bg-primary-50"
                                    >
                                        <ChevronRight className="w-4 h-4 text-primary-700" />
                                    </Button>
                                </div>
                            </div>
                        </CardAction>
                    </CardFooter>
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
                    onDeletePayment={(payment) => handleDeletePayment(payment, selectedCliente.id_client)}
                    data={{ ...selectedCliente, payments: selectedPayments }}
                />
            )}
        </div>
    );
}
