"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { ClientPaymentInfo } from "../models/client-model";
import { useState } from "react";

type DialogDeletePaymentProps = {
    isOpen: boolean;
    onClose: () => void;
    client: ClientPaymentInfo | undefined;
    onDelete: (client: ClientPaymentInfo) => void;
};

export default function DialogDeletePayment({ isOpen, onClose, client, onDelete }: DialogDeletePaymentProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    if (!client) return null;
    const handleDelete = () => {
        onDelete(client);
        setConfirmOpen(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-red-700">Eliminar Cliente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <p className="text-base">
                            ¿Seguro que deseas eliminar al cliente <span className="font-semibold">{client.name} {client.lastname}</span>?
                        </p>
                        <p className="text-sm text-red-600 mt-2">
                            Esta acción eliminará todos los registros asociados y no se puede deshacer.
                        </p>
                    </div>
                </div>
                <DialogFooter className="flex flex-row gap-2 mt-4">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => setConfirmOpen(true)}>
                        Eliminar
                    </Button>
                </DialogFooter>
                {/* AlertDialog para confirmar */}
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                            <AlertDialogDescription>
                                ¿Estás seguro que deseas eliminar al cliente <span className="font-semibold">{client.name} {client.lastname}</span>? Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Eliminar Cliente</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    );
}

