'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DrawalsViewData } from "../model/drawals-model";

interface DeleteDialogProps {
    onDelete: () => void;
    onCancel: () => void;
    props: DrawalsViewData;
    isOpen: boolean;
}

export default function DeleteDialog({ onDelete, onCancel, isOpen, props }: DeleteDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Cancelar este retiro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará el retiro programado de {props.name_client}.
                        Los datos no se podrán recuperar.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                        Sí, Cancelar Retiro
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}