'use client'

interface sendWhatsappMessageModel {
    name: string;
    phone: string;
    message: string;
}

export async function sendWhatsappMessageAction(data: sendWhatsappMessageModel) {
    try {
        const cleanPhone = data.phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(data.message);
        const whatsappUrl = `https://wa.me/+56${cleanPhone}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        return { success: true };
    } catch (error) {
        console.error("Error al abrir WhatsApp:", error);
        return { success: false, error: "No se pudo redirigir a WhatsApp" };
    }
}

