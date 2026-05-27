"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"
import { sendWhatsappMessageAction } from "../actions/send-whatsapp-action"

interface DialogWhatsappProps {
    isOpen: boolean
    onClose: () => void
    name: string
    phone: string
    messageRecibe: string
}

export function DialogWhatsapp({ isOpen, onClose, name, phone , messageRecibe}: DialogWhatsappProps) {
    const [message, setMessage] = useState(messageRecibe || '')

    const handleSend = async () => {
        await sendWhatsappMessageAction({
            name,
            phone,
            message: messageRecibe || message
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
                        El mensaje será enviado al número: {phone}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea
                            id="message"
                            placeholder="Escribe tu mensaje aquí..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[120px] resize-none"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button 
                        onClick={handleSend} 
                        disabled={!message.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Abrir WhatsApp
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
