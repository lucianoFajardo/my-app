"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Check, ChevronLeft, ChevronRight, Search, CreditCard, User, AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ClientPaymentInfo } from "../models/client-model";
import { DataClientPaymentInfo } from "../actions/read-client-data-action";
import ShowPayments from "./show-payments";
import { readPaymentsAction } from "../actions/read-payments-action";
import { Payment } from "../models/payment-model";
import deleteDialogPaymentAction from "../actions/payment-delete-action";
import { getMonthsDue, getPlanStatus } from "../actions/status-plan-action";
import { DialogPayment } from "./dialog-payment";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { DateRange } from "react-day-picker";

// Normaliza una fecha (string o Date) a un string 'YYYY-MM-DD'
const normalizeDateStr = (d: string | Date): string => {
    const date = typeof d === 'string' ? new Date(d) : d;
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
    const [searchParam, setSearchParam] = useState<string | undefined>("");
    const [page, setPage] = useState(0);
    const itemsPerPage = 30;
    const [showDebtorsOnly, setShowDebtorsOnly] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const from = page * itemsPerPage;
            const to = from + itemsPerPage - 1;
            const rawData = await DataClientPaymentInfo({ from, to, searchParam });
            const processedData = rawData.map(client => {
                const safePaidMonths = normalizePaidMonths(client.paidMonths);
                const dueMonths = getMonthsDue(client.initial_payment, safePaidMonths);
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
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [page, searchParam]);

    const isDateInRange = (d: string | Date, range?: DateRange) => {
        if (!range?.from) return true;
        const date = typeof d === "string" ? new Date(d) : d;
        const from = new Date(range.from);
        const to = range.to ? new Date(range.to) : new Date(range.from);
        date.setHours(0, 0, 0, 0);
        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);
        return date >= from && date <= to;
    };

    const displayedClients = clientInfo.filter(c => {
        const debtorOk = !showDebtorsOnly || c.planStatus !== "paid";
        const dateOk = isDateInRange(c.initial_payment, ); // TODO: Revisa tu variable de rango
        return debtorOk && dateOk;
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParam(e.target.value);
        setPage(0);
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
        setClientInfo(prevClients => prevClients.map(c => {
            if (c.id_client === client.id_client) {
                const combinedPaidMonths = [...(c.paidMonths || []), ...paidMonthDates];
                const newPaidMonths = normalizePaidMonths(combinedPaidMonths);
                const newDueMonths = getMonthsDue(c.initial_payment, newPaidMonths);
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

        setSelectedCliente(prevSelected => {
            if (!prevSelected || prevSelected.id_client !== client.id_client) return prevSelected;
            const combinedPaidMonths = [...(prevSelected.paidMonths || []), ...paidMonthDates];
            const newPaidMonths = normalizePaidMonths(combinedPaidMonths);
            const newDueMonths = getMonthsDue(prevSelected.initial_payment, newPaidMonths);
            const newStatus = getPlanStatus(newDueMonths);
            return {
                ...prevSelected,
                paidMonths: newPaidMonths,
                monthsDue: newDueMonths,
                planStatus: newStatus
            };
        });
    }, []);

    const handleNextPage = () => setPage(prev => prev + 1);
    const handelePreviousPage = () => setPage(page > 0 ? page - 1 : 0);

    return (
        <div className="container mx-auto py-6 px-4 md:px-0">
            <Card className="w-full mx-auto border-border bg-card shadow-sm rounded-xl overflow-hidden">
                
                {/* Cabecera / Filtros */}
                <CardHeader className="bg-muted/30 pb-6 pt-5 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">Gestión de Pagos</CardTitle>
                                <CardDescription className="text-muted-foreground mt-0.5 text-sm">
                                    Controla los pagos, vencimientos y estados de los clientes.
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <Button
                                variant={showDebtorsOnly ? "destructive" : "outline"}
                                onClick={() => setShowDebtorsOnly(prev => !prev)}
                                className={cn("h-9 text-sm shadow-sm", showDebtorsOnly ? "" : "text-muted-foreground")}
                            >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                {showDebtorsOnly ? "Mostrando deudores" : "Filtrar deudores"}
                            </Button>
                            <div className="relative w-full sm:w-64 md:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar cliente..."
                                    value={searchParam}
                                    onChange={handleSearch}
                                    className="pl-9 bg-background h-9 text-sm border-border/60 focus-visible:ring-primary/20 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {/* Tabla */}
                <CardContent className="p-0">
                    <div className="max-h-[60vh] overflow-y-auto">
                        <Table className="w-full">
                            <TableHeader className="bg-muted/40 sticky top-0 z-10 hidden sm:table-header-group">
                                <TableRow className="border-b border-border/60 hover:bg-transparent">
                                    <TableHead className="font-semibold text-foreground h-11">Nombre</TableHead>
                                    <TableHead className="font-semibold text-foreground h-11">Antena</TableHead>
                                    <TableHead className="font-semibold text-foreground h-11">Plan</TableHead>
                                    <TableHead className="font-semibold text-foreground h-11">Instalación</TableHead>
                                    <TableHead className="font-semibold text-foreground h-11">Fechas de pago</TableHead>
                                    <TableHead className="font-semibold text-foreground h-11 text-center">Estado</TableHead>
                                    <TableHead className="font-semibold text-foreground h-11 text-center">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayedClients.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No se encontraron clientes.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {displayedClients.map((cliente) => (
                                    <TableRow key={cliente.id_client} className="hover:bg-muted/30 border-b border-border/60 transition-colors">
                                        <TableCell className="font-medium text-sm text-foreground">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground hidden sm:block" />
                                                <span>{cliente.name} {cliente.lastname}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{cliente.antenna_name}</TableCell>
                                        <TableCell className="text-sm font-semibold">${cliente.plan}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(cliente.initial_payment).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">{cliente.range_payment}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[11px] font-semibold border",
                                                cliente.planStatus === 'paid' 
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                                : "bg-destructive/10 text-destructive border-destructive/20"
                                            )}>
                                                {cliente.planStatus === 'paid' ? 'Al día' : `Debe ${cliente.monthsDue.length || 0} mes(es)`}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center flex items-center justify-center gap-2">
                                            <Button
                                                onClick={() => handleOpenDialog(cliente)}
                                                size="sm"
                                                className="h-8 text-xs shadow-sm bg-primary hover:bg-primary/90"
                                            >
                                                <Check className="w-3.5 h-3.5 mr-1.5" /> Pagar
                                            </Button>
                                            <Button
                                                onClick={() => handleShowPayments(cliente)}
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs border-border/80"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1.5" /> Ver
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>

                {/* Footer Paginación */}
                <CardFooter className="py-4 px-6 bg-muted/20 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground font-medium">
                        Página Actual {page + 1}
                    </span>
                    <div className="flex items-center gap-1 bg-background rounded-md border shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handelePreviousPage}
                            disabled={page === 0}
                            className="h-8 w-8 rounded-r-none hover:bg-muted"
                        >
                            <ChevronLeft className="w-4 h-4 text-foreground" />
                        </Button>
                        <div className="w-1px h-4 bg-border"></div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNextPage}
                            disabled={clientInfo.length < (itemsPerPage * (page + 1))}
                            className="h-8 w-8 rounded-l-none hover:bg-muted"
                        >
                            <ChevronRight className="w-4 h-4 text-foreground" />
                        </Button>
                    </div>
                </CardFooter>
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