"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { ClientPaymentInfo, DueMonth } from "../models/client-model";
import { paymentDataClientAction } from "../actions/payement-client-action";

type DialogPaymentProps = {
    isOpen: boolean;
    onClose: () => void;
    data: ClientPaymentInfo | undefined;
    // CAMBIO: Ahora espera un array de strings con las fechas pagadas
    onPaySuccess: (client: ClientPaymentInfo, paidMonthDates: string[]) => void;
};

export function DialogPayment({ isOpen, onClose, data, onPaySuccess }: DialogPaymentProps) {
    const [loading, setLoading] = useState(false);
    const [selectedMonthsToPay, setSelectedMonthsToPay] = useState<DueMonth[]>([]);

    if (!data) return null;

    // Usamos el campo monthsDue que ya viene calculado del componente padre (App)
    const dueMonths = data.monthsDue instanceof Array ? data.monthsDue : [];
    const totalToPay = selectedMonthsToPay.length * Number(data.plan);
    const isPayButtonDisabled = loading || selectedMonthsToPay.length === 0;

    const toggleMonthSelection = (month: DueMonth) => {
        setSelectedMonthsToPay(prev => {
            const index = prev.findIndex(m => m.date === month.date);
            if (index >= 0) {
                // Deseleccionar: crear un nuevo array sin el mes
                return prev.filter((_, i) => i !== index);
            } else {
                // Seleccionar: crear un nuevo array con el mes y mantener el orden por fecha
                // Aseguramos que la nueva selección esté ordenada cronológicamente
                const newSelection = [...prev, month];
                newSelection.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // CRUCIAL: Solo permitir selecciones CONSECUTIVAS desde el inicio de la deuda.
                // Si el usuario selecciona un mes que no es consecutivo al último seleccionado, forzamos la selección hasta ese punto.
                if (newSelection.length > 1) {
                    const selectedDates = newSelection.map(m => m.date);
                    // Asegurar que la selección sea contigua desde el primer mes adeudado
                    const isContiguous = selectedDates.every((date, idx) => {
                        if (idx === 0) return true; // El primer mes siempre es válido
                        // Comprobar que el mes actual es el siguiente al anterior en la lista 'dueMonths'
                        const prevMonthIndexInDue = dueMonths.findIndex(m => m.date === selectedDates[idx - 1]);
                        const currentMonthIndexInDue = dueMonths.findIndex(m => m.date === date);
                        return currentMonthIndexInDue === prevMonthIndexInDue + 1;
                    });

                    if (!isContiguous) {
                        // Si se rompe la contigüidad, ajustamos la selección a los meses contiguos hasta el mes clickeado
                        const currentMonthIndex = dueMonths.findIndex(m => m.date === month.date);
                        return dueMonths.slice(0, currentMonthIndex + 1);
                    }
                }
                return newSelection;
            }
        });
    };

    const selectAllMonths = () => {
        if (dueMonths.length > 0) {
            setSelectedMonthsToPay(dueMonths);
        }
    };

    const clearSelection = () => {
        setSelectedMonthsToPay([]);
    };

    const handlePaySelectedMonths = async () => {
        if (isPayButtonDisabled) return;
        setLoading(true);
        try {
            // 1. Preparamos las fechas que se pagarán (este es el array que necesitamos)
            const datesToPay = selectedMonthsToPay.map(m => m.date);
            // 2. Calculamos la nueva fecha hasta la que estará pagado (para la BD)
            const lastPaidMonth = selectedMonthsToPay[selectedMonthsToPay.length - 1];
            const lastPaidMonthDate = new Date(lastPaidMonth.date);
            lastPaidMonthDate.setMonth(lastPaidMonthDate.getMonth() + 1);
            const newPaidUntilDate = lastPaidMonthDate.toISOString().split('T')[0];

            // 3. Ejecutamos la acción del servidor
            await paymentDataClientAction(data, datesToPay, newPaidUntilDate, totalToPay);
            onPaySuccess(data, datesToPay);
            setSelectedMonthsToPay([]); // Limpiar selección
            onClose(); // Cerramos el diálogo al éxito
        } catch (error) {
            // Implementar notificación de error aquí
            throw new Error(`Error al procesar el pago. Por favor, intenta nuevamente. ${error}`);
        } finally {
            setLoading(false);
        }
    };

    // Estilos de los meses
    const getMonthChipStyle = (month: DueMonth) => {
        const isSelected = selectedMonthsToPay.some(m => m.date === month.date);
        return isSelected
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 border border-gray-300';
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white p-6">
                <DialogHeader>
                    <DialogTitle>Pagos Pendientes (Multi-Selección)</DialogTitle>
                    <DialogDescription>
                        Cliente: <span className="font-semibold text-indigo-700">{data.name} {data.lastname}</span>
                        <br />
                        Pagado Hasta: <span className="font-semibold text-indigo-700"> {data.paid_until_date}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">
                        Selecciona los meses específicos a cubrir (${totalToPay} c/u):
                    </h4>

                    <div className="flex justify-start gap-2 mb-3">
                        {dueMonths.length > 0 && (
                            <>
                                <Button variant="outline" size="sm" onClick={selectAllMonths} className="text-xs py-1 h-auto">
                                    Seleccionar Todo ({dueMonths.length})
                                </Button>
                                {selectedMonthsToPay.length > 0 && (
                                    <Button variant="outline" size="sm" onClick={clearSelection} className="text-xs py-1 h-auto text-red-700 hover:bg-red-50 bg-red-100">
                                        Limpiar Selección
                                    </Button>
                                )}
                            </>
                        )}
                    </div>

                    <ScrollArea className="h-[250px] w-full rounded-md border bg-gray-50 p-4">
                        {dueMonths.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {dueMonths.map((month) => (
                                    <button
                                        key={month.date}
                                        onClick={() => toggleMonthSelection(month)}
                                        disabled={loading}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition duration-200 ${getMonthChipStyle(month)}`}
                                    >
                                        {month.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-green-600 gap-2 min-h-[200px]">
                                <CheckCircle2 className="w-12 h-12" />
                                <p className="font-semibold">¡El cliente está al día!</p>
                            </div>
                        )}
                    </ScrollArea>

                    {/* Resumen y Botón de Pago */}
                    <div className="border-t pt-4 flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-800">
                            Total: <span className="text-indigo-600">${totalToPay.toFixed(4)}</span> ({selectedMonthsToPay.length} meses)
                        </p>
                        <Button
                            onClick={handlePaySelectedMonths}
                            disabled={isPayButtonDisabled}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading ? "Procesando..." : "Pagar Seleccionados"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}