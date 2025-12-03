import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ClientPaymentInfo } from "../models/client-model";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Payment } from "../models/payment-model";

interface ShowPaymentsProps {
    isOpen: boolean;
    onClose: () => void;
    data: ClientPaymentInfo;
    onDeletePayment: (payment: Payment) => void; // Puedes tipar mejor si tienes el modelo
}

export default function ShowPayments({ isOpen, onClose, data, onDeletePayment }: ShowPaymentsProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="max-w-2xl bg-white">
                <DialogTitle className="text-sm font-bold ">Historial de Pagos cliente: {data?.name}</DialogTitle>
                <DialogDescription className="text-sm">
                    Revisa el historial de pagos realizados por el cliente.
                </DialogDescription>
                <div className="space-y-2 mt-4">
                    {data.payments && data.payments.length > 0 ? (
                        data.payments.map((payment) => (
                            <Alert key={payment.id_payments} className="border-l-4 border-primary-500 bg-primary-50 flex items-center justify-between">
                                <div>
                                    <AlertTitle>
                                        Pago de ${data.plan} - {payment.status_payment ? "Completado" : "Pendiente"}
                                    </AlertTitle>
                                    <AlertDescription>
                                        Fecha: {payment.payment_date}
                                    </AlertDescription>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="ml-4"
                                    onClick={() => onDeletePayment(payment)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </Alert>
                        ))
                    ) : (
                        <Alert className="border-l-4 border-yellow-500 bg-yellow-50">
                            <AlertTitle>Sin pagos registrados</AlertTitle>
                            <AlertDescription>
                                Este cliente aún no tiene historial de pagos.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}