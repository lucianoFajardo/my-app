"use client"

import { ClienteModel } from "../models/client-model"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    User,
    Mail,
    Phone,
    Wifi,
    MapPin,
    CalendarDays,
    CreditCard,
    FileText,
    Info,
    Globe2,
    Calendar
} from "lucide-react"
import {
    Map,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapZoomControl,
} from "@/components/ui/map"

interface ShowDataPageProps {
    props: ClienteModel
    onClose: () => void
    isOpen: boolean
}

export default function ShowDataPageClient({ props, onClose, isOpen }: ShowDataPageProps) {

    const latitude = parseFloat(props.latitude);
    const longitude = parseFloat(props.longitude);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl mx-auto rounded-xl shadow-2xl bg-white p-6 border border-primary-100">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary-700 flex items-center gap-2 mb-2">
                        <Info className="w-6 h-6 text-primary-500" />
                        Información del Cliente
                    </DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto">
                    <Card className="mb-4 shadow border border-primary-100">
                        <CardHeader>
                            <CardTitle className="text-lg text-primary-700 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary-500" />
                                {props.name} {props.lastname}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <Phone className="w-4 h-4 text-green-500" /> Teléfono 1
                                        </TableCell>
                                        <TableCell>{props.phone1}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <Phone className="w-4 h-4 text-green-400" /> Teléfono 2
                                        </TableCell>
                                        <TableCell>{props.phone2}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <Wifi className="w-4 h-4 text-purple-500" /> Antena
                                        </TableCell>
                                        <TableCell>{props.antennaName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <MapPin className="w-4 h-4 text-orange-500" /> Sector
                                        </TableCell>
                                        <TableCell>{props.sector}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <FileText className="w-4 h-4 text-primary-500" /> Plan
                                        </TableCell>
                                        <TableCell>{props.plan}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <Calendar className="w-4 h-4 text-pink-500" /> rango de fechas
                                        </TableCell>
                                        <TableCell>{props.range_payment}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <CreditCard className="w-4 h-4 text-yellow-500" /> Método de Pago
                                        </TableCell>
                                        <TableCell>{props.paymentMethod}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <Globe2 className="w-4 h-4 text-blue-500" /> Latitud
                                        </TableCell>
                                        <TableCell>{props.latitude}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <Globe2 className="w-4 h-4 text-blue-400" /> Longitud
                                        </TableCell>
                                        <TableCell>{props.longitude}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2 font-medium text-primary-700">
                                            <FileText className="w-4 h-4 text-primary-500" /> Observaciones
                                        </TableCell>
                                        <TableCell>{props.observations}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            {/* Espacio para el mapa */}
                            <div className="mt-6">
                                <Label className="text-primary-700 flex items-center gap-2 mb-2">
                                    <MapPin className="w-5 h-5 text-orange-500" />
                                    Ubicación en el mapa
                                </Label>
                                <div className="w-full  rounded-lg border border-primary-100 bg-primary-50 flex items-center justify-center">
                                    {/* Aquí puedes agregar tu componente de mapa */}
                                    <span className="w-full h-full">
                                        <Map center={[latitude, longitude]} zoom={12}>
                                            <MapTileLayer />
                                            <MapZoomControl />
                                            <MapMarker position={[latitude, longitude]}>
                                                <MapPopup>A map component for shadcn/ui.</MapPopup>
                                            </MapMarker>
                                        </Map>
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DialogFooter className="flex justify-end mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}