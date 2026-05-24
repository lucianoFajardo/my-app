"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { ClienteModel } from "../models/client-model";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { deleteClientAction } from "../actions/delete-client-action";

export interface ClienteEditProps {
    cliente: ClienteModel;
    isOpen: boolean;
    onCancel?: () => void;
    onSubmit?: (data: ClienteModel) => void;
}

export const DialogDeleteCliente = ({ cliente, onCancel, isOpen, onSubmit }: ClienteEditProps) => {

    const handleDelete = (data: ClienteModel) => {
        const dataDelete = { ...data }
        deleteClientAction(dataDelete.id_client.toString()).then(() => {
            if (onSubmit) onSubmit(dataDelete);
            console.log("Cliente eliminado con éxito");
        }).catch((error) => {
            console.error("Error al eliminar el cliente:", error);
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="max-w-md mx-auto rounded-xl shadow-2xl bg-white p-6 border border-red-100">
                <DialogHeader className="flex flex-col items-center gap-2">
                    <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
                    <DialogTitle className="text-center text-xl font-bold text-red-700">
                        ¿Eliminar cliente?
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-gray-600">
                        Esta acción no se puede deshacer.<br />
                        ¿Estás seguro de que deseas eliminar a <span className="font-semibold text-red-700">{cliente.name},
                        </span> con direccion registrada : <span className="font-semibold text-red-700">{cliente.antenna_name}</span>,
                        una vez los datos se eliminen se perdera registro de este cliente.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2 mt-6">
                    <Button onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            handleDelete(cliente);
                            if (onCancel) onCancel();
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}