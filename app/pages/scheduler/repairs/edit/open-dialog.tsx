import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Activity, CalendarIcon, Clock, MapPin, Phone, User } from "lucide-react";
import { pendingRepairDataModel } from "../model/show-data-repair-model";
import { format } from "date-fns/format";
import { parseISO } from "date-fns/parseISO";
import { es } from "date-fns/locale/es";


interface OpenDialogProps {
    isOpen: () => boolean;
    isClose: () => void;
    selectDetails: pendingRepairDataModel | null;
}

export default function OpenDialog({ isOpen, isClose, selectDetails }: OpenDialogProps) {
    return (
        <Dialog open={isOpen()} onOpenChange={isClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Detalles de la Reparación</DialogTitle>
                    <DialogDescription>Información del servicio técnico.</DialogDescription>
                </DialogHeader>
                {selectDetails && (
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><User className="w-5 h-5" /></div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Cliente</p>
                                <p className="font-semibold text-slate-800">{selectDetails.clients?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><MapPin className="w-5 h-5" /></div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Dirección</p>
                                <p className="text-slate-800">{selectDetails.clients?.antenna_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Phone className="w-5 h-5" /></div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Teléfonos</p>
                                <p className="text-slate-800">{selectDetails.clients?.phone1} {selectDetails.clients?.phone2 ? `/ ${selectDetails.clients?.phone2}` : ''}</p>
                            </div>
                        </div>

                        {/* <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="text-sm text-slate-500 font-medium mb-1">Notas / Motivo</p>
                                <p className="text-slate-800 text-sm">{selectDetails.notes || 'Ninguna nota agregada'}</p>
                            </div> */}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><CalendarIcon className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Fecha</p>
                                    <p className="text-slate-800 text-sm">{format(parseISO(selectDetails.date_repair), "dd 'de' MMMM", { locale: es })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Clock className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Hora</p>
                                    <p className="text-slate-800">{selectDetails.hour_repair} hrs</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Activity className="w-5 h-5" /></div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Estado</p>
                                <Badge variant="secondary" className={selectDetails.status === 'completed' ? 'bg-green-100 text-green-700 mt-1' : 'bg-orange-100 text-orange-700 mt-1'}>
                                    {selectDetails.status === 'completed' ? 'RESUELTO' : 'PENDIENTE'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}




