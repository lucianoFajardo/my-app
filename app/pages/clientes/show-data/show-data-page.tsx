"use client"

import { useState } from "react"
import { ClienteModel } from "../models/client-model"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    User,
    Phone,
    Wifi,
    MapPin,
    CreditCard,
    Info,
    Calendar,
    StickyNote,
    MonitorSmartphone,
    Building2,
    MessageCircle
} from "lucide-react"
import {
    Map,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapZoomControl,
} from "@/components/ui/map"
import { DialogDescription } from "@radix-ui/react-dialog"
import { DialogWhatsapp } from "./dialog-whatsapp"

interface ShowDataPageProps {
    props: ClienteModel
    onClose: () => void
    isOpen: boolean
}

// Componente helper para dibujar filas de datos limpias
const DataRow = ({ icon: Icon, label, value, highlight = false }: { icon: React.ElementType, label: string, value: React.ReactNode, highlight?: boolean }) => (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
        <div className="flex items-center gap-3 text-muted-foreground">
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
        </div>
        <div className={`text-sm font-medium text-right ${highlight ? 'text-primary' : 'text-foreground'}`}>
            {value || <span className="text-muted-foreground italic">No registrado</span>}
        </div>
    </div>
)

export default function ShowDataPageClient({ props, onClose, isOpen }: ShowDataPageProps) {
    const latitude = parseFloat(props.latitude);
    const longitude = parseFloat(props.longitude);
    const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 mx-auto rounded-xl shadow-xl bg-card border-border/60 overflow-hidden">
                
                {/* Header */}
                <DialogHeader className="bg-muted/30 px-6 py-5 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                                {props.name} {props.lastname}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1">
                                Información detallada del cliente e instalación.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col md:flex-row h-full max-h-[70vh]">
                    {/* Columna Izquierda: Lista de Datos */}
                    <div className="w-full md:w-[45%] flex flex-col border-r border-border/60 overflow-y-auto">
                        <div className="p-6">
                            
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                <Info className="w-3.5 h-3.5" /> General & Contacto
                            </h4>
                            <div className="bg-muted/10 rounded-lg p-2 mb-6">
                                <DataRow icon={Phone} label="Teléfono 1" value={props.phone1} />
                                <DataRow icon={Phone} label="Teléfono 2" value={props.phone2} />
                            </div>

                            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                <MonitorSmartphone className="w-3.5 h-3.5" /> Servicio Contratado
                            </h4>
                            <div className="bg-muted/10 rounded-lg p-2 mb-6">
                                <DataRow icon={Wifi} label="Antena" value={props.antenna_name} />
                                <DataRow icon={Building2} label="Sector" value={props.sector} />
                                <DataRow icon={MonitorSmartphone} label="Plan Mensual" value={`$${props.plan}`} highlight />
                            </div>

                            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                <CreditCard className="w-3.5 h-3.5" /> Facturación
                            </h4>
                            <div className="bg-muted/10 rounded-lg p-2">
                                <DataRow icon={Calendar} label="Días de Pago" value={props.range_payment} />
                                <DataRow icon={CreditCard} label="Método" value={<span className="capitalize">{props.payment_method}</span>} />
                            </div>

                        </div>
                    </div>

                    {/* Columna Derecha: Mapa y Notas */}
                    <div className="w-full md:w-[55%] flex flex-col bg-muted/5 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            
                            {/* Notas (Solo si existen) */}
                            {props.observations && (
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                                        <StickyNote className="w-3.5 h-3.5" /> Observaciones
                                    </h4>
                                    <div className="text-sm text-foreground bg-background p-4 rounded-lg border shadow-sm leading-relaxed">
                                        {props.observations}
                                    </div>
                                </div>
                            )}

                            {/* Mapa */}
                            <div>
                                <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3 flex flex-wrap items-center justify-between gap-2">
                                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Ubicación</span>
                                    <span className="font-mono text-[10px] lowercase text-muted-foreground/80">
                                        L: {props.latitude}, l: {props.longitude}
                                    </span>
                                </h4>
                                <div className="w-full h-320px rounded-lg border border-border/80 bg-background overflow-hidden relative shadow-sm">
                                    <Map center={[latitude, longitude]} zoom={13}>
                                        <MapTileLayer />
                                        <MapZoomControl />
                                        <MapMarker position={[latitude, longitude]}>
                                            <MapPopup>
                                                <div className="text-xs">
                                                    <strong>{props.name} {props.lastname}</strong><br/>
                                                    {props.antenna_name}
                                                </div>
                                            </MapPopup>
                                        </MapMarker>
                                    </Map>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer estético */}
                <DialogFooter className="bg-muted/30 border-t px-6 py-4 flex items-center justify-between sm:justify-between">
                    <Button 
                        variant="outline" 
                        className="shadow-sm border-border/80 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                        onClick={() => setIsWhatsappOpen(true)}
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Enviar WhatsApp
                    </Button>
                    <Button variant="outline" onClick={onClose} className="shadow-sm border-border/80">
                        Cerrar Detalles
                    </Button>
                </DialogFooter>
            </DialogContent>
            
            {/* Modal de WhatsApp para no sobrecargar este */}
            <DialogWhatsapp 
                isOpen={isWhatsappOpen} 
                onClose={() => setIsWhatsappOpen(false)} 
                name={`${props.name} ${props.lastname}`}
                phone={props.phone1}
                messageRecibe={`Hola ${props.name}, espero que estés bien.
                    Quería comunicarme contigo para hablar sobre tu servicio de internet. 
                    Si tienes alguna pregunta o necesitas asistencia, no dudes en responder a este mensaje. 
                    ¡Gracias por ser parte de nuestra comunidad!`
                }   
            />
        </Dialog>
    )
}