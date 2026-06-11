"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"
import { sendWhatsappMessageAction } from "../actions/send-whatsapp-action"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DialogWhatsappProps {
    isOpen: boolean
    onClose: () => void
    name: string
    phone: string | string[] // 1. Aceptamos un string o un array de strings
    messageRecibe: string
}

export function DialogWhatsapp({ isOpen, onClose, name, phone , messageRecibe}: DialogWhatsappProps) {
    const phoneList = Array.isArray(phone) 
        ? phone 
        : typeof phone === 'string' 
            ? phone.split(',').map(n => n.trim()) 
            : [];

    const [message, setMessage] = useState(messageRecibe || '')
    const [phoneSelected, setPhoneSelected] = useState(phoneList[0] || "")

    useEffect(() => {
        setPhoneSelected(phoneList[0] || "");
    }, [phone])

    const handleSend = async () => {
        await sendWhatsappMessageAction({
            name,
            phone: phoneSelected, 
            message: message || messageRecibe
        });
        onClose();
        setMessage("");
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-500" />
                        Enviar WhatsApp a {name}
                    </DialogTitle>
                    <DialogDescription>
                            Personaliza el mensaje que deseas enviar a través de WhatsApp seleccionando un numero.
                    </DialogDescription>
                        <Select value={phoneSelected} onValueChange={(value) => setPhoneSelected(value)}>
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue placeholder="Selecciona un número" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Números</SelectLabel>
                                {/* 6. Iteramos sobre nuestra lista de números */}
                                {phoneList.map((num, i) => (
                                    <SelectItem key={i} value={num}>
                                        {num}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    
                    <DialogDescription>
                        El mensaje será enviado al número: <span className="font-semibold">{phoneSelected}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea
                            id="message"
                            placeholder="Escribe tu mensaje aquí..."
                            value={message.trim().split(/\s+/)? message : messageRecibe} // Si el mensaje está vacío, mostramos el mensaje recibido
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[120px] resize-none"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button 
                        onClick={handleSend} 
                        disabled={!message.trim() || !phoneSelected}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Abrir WhatsApp
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}