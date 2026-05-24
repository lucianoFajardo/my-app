"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, Calendar, ChevronDown, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { ClientPaymentInfo } from "../models/client-model";
import { paymentDataClientAction } from "../actions/payement-client-action";
import { getAllPaymentMonths } from "../actions/status-plan-action";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type DialogPaymentProps = {
    isOpen: boolean;
    onClose: () => void;
    data: ClientPaymentInfo | undefined;
    onPaySuccess: (client: ClientPaymentInfo, paidMonthDates: string[]) => void;
};

export function DialogPayment({ isOpen, onClose, data, onPaySuccess }: DialogPaymentProps) {
    const [loading, setLoading] = useState(false);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    //* --> Estado para controlar qué acordeón está abierto por defecto
    const [openSections, setOpenSections] = useState({
        overdue: true,
        future: false,
        paid: false
    });
    //* --> Memoización de los meses con su estado para evitar cálculos innecesarios en cada render
    const allMonths = useMemo(() => {
        if (!data) return [];
        return getAllPaymentMonths(data.initial_payment, data.paid_until_date || data.initial_payment);
    }, [data]);
    
    if (!data) return null;
    const paidMonths = allMonths.filter(m => m.status === 'paid');
    const overdueMonths = allMonths.filter(m => m.status === 'overdue');
    const futureMonths = allMonths.filter(m => m.status === 'future' || m.status === 'current');
    const totalToPay = selectedDates.length * Number(data.plan); //* --> Calcular el total a pagar y lo multiplicamos por el total del plan que tiene el cliente
    const isPayButtonDisabled = loading || selectedDates.length === 0;

    const toggleSelection = (monthDate: string) => {
        setSelectedDates(prev => {
            if (prev.includes(monthDate)) {
                return prev.filter(d => d !== monthDate);
            }
            return [...prev, monthDate].sort();
        });
    };
    const handlePaySelected = async () => {
        if (isPayButtonDisabled) return;
        setLoading(true);
        try {
            const lastMonth = selectedDates[selectedDates.length - 1];
            const lastPaidMonthDate = new Date(lastMonth);
            lastPaidMonthDate.setMonth(lastPaidMonthDate.getMonth() + 1);
            const newPaidUntilDate = lastPaidMonthDate.toISOString().split('T')[0];
            console.log('nueva fecha de pago ' , newPaidUntilDate);
            //* --> Procesamos el pago del cliente
            await paymentDataClientAction(data, selectedDates, newPaidUntilDate, totalToPay); //*--> Procesamos los pagos y actualizamos la fecha hasta la que el cliente está pagado (*).(*)
            //* --> Estado nuevo del cliente con las fechas actualizadas despues de realizar el pago
            const updatedClient: ClientPaymentInfo = {
                ...data,
                paid_until_date: newPaidUntilDate
            };
            onPaySuccess(updatedClient, selectedDates);
            setSelectedDates([]);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 mx-auto rounded-xl shadow-xl bg-card border-border/60 overflow-hidden">
                <DialogHeader className="bg-muted/30 px-6 py-5 border-b">
                    <div>
                        <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Registro de Pagos
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-sm">
                            Cliente: <span className="font-medium text-foreground">{data.name} {data.lastname}</span>
                            <br />Plan Base: <span className="font-semibold text-primary">${data.plan}</span>
                            <br />Fecha de Instalación: <span className="font-medium text-foreground">{new Date(data.initial_payment).toLocaleDateString()}</span>
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] px-6 py-4">
                    <div className="space-y-4">

                        {/* 1. MESES ADEUDADOS */}
                        <Collapsible open={openSections.overdue} onOpenChange={() => toggleSection('overdue')} className="border rounded-lg bg-destructive/5 overflow-hidden">
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 font-medium text-destructive hover:bg-destructive/10 transition-colors">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Deuda Pendiente ({overdueMonths.length})
                                </div>
                                <ChevronDown className={cn("w-4 h-4 transition-transform", openSections.overdue && "rotate-180")} />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-3 pt-0 grid grid-cols-2 gap-2 mt-2">
                                {overdueMonths.length === 0 && <span className="text-xs text-muted-foreground col-span-2">Sin deudas</span>}
                                {overdueMonths.map(month => (
                                    <Button
                                        key={month.date}
                                        type="button"
                                        variant={selectedDates.includes(month.date) ? "default" : "outline"}
                                        onClick={() => toggleSelection(month.date)}
                                        className={cn(
                                            "justify-start h-9 text-xs",
                                            !selectedDates.includes(month.date) && "border-destructive/30 text-destructive hover:bg-destructive/10"
                                        )}
                                    >
                                        {month.name}
                                    </Button>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>

                        {/* 2. MESES ACTUALES / FUTUROS */}
                        <Collapsible open={openSections.future} onOpenChange={() => toggleSection('future')} className="border rounded-lg bg-muted/10 overflow-hidden">
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 font-medium text-foreground hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" /> Pagos Futuros / Próximos
                                </div>
                                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", openSections.future && "rotate-180")} />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-3 pt-0 grid grid-cols-2 gap-2 mt-2">
                                {futureMonths.map(month => (
                                    <Button
                                        key={month.date}
                                        type="button"
                                        variant={selectedDates.includes(month.date) ? "default" : "outline"}
                                        onClick={() => toggleSelection(month.date)}
                                        className="justify-start h-9 text-xs"
                                    >
                                        {month.name}
                                    </Button>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>

                        {/* 3. MESES PAGADOS (Historial) */}
                        <Collapsible open={openSections.paid} onOpenChange={() => toggleSection('paid')} className="border rounded-lg bg-emerald-50/50 overflow-hidden">
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 font-medium text-emerald-700 hover:bg-emerald-100/50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Pagos Realizados ({paidMonths.length})
                                </div>
                                <ChevronDown className={cn("w-4 h-4 transition-transform", openSections.paid && "rotate-180")} />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-3 pt-0 grid grid-cols-2 gap-2 mt-2">
                                {paidMonths.length === 0 && <span className="text-xs text-muted-foreground col-span-2">Aún no hay pagos</span>}
                                {paidMonths.map(month => (
                                    <div key={month.date} className="flex items-center gap-2 p-2 border border-emerald-200 bg-emerald-50 rounded-md opacity-70">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-xs font-medium text-emerald-800 truncate">{month.name}</span>
                                    </div>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>

                    </div>
                </ScrollArea>

                {/* Footer de facturación */}
                <div className="bg-muted/30 border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left w-full sm:w-auto">
                        <p className="text-sm text-muted-foreground">Meses a pagar: <span className="font-semibold text-foreground">{selectedDates.length}</span></p>
                        <p className="text-lg font-bold text-foreground">
                            Total: <span className="text-primary">${totalToPay.toFixed(3)}</span>
                        </p>
                    </div>
                    <Button
                        onClick={handlePaySelected}
                        disabled={isPayButtonDisabled}
                        className="w-full sm:w-auto shadow-sm"
                    >
                        {loading ? "Procesando..." : "Confirmar Pago"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}