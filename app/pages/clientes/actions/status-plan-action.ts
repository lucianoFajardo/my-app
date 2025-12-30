import { DetailedStatus, PaymentStatus } from "../models/client-model";

// Definimos la estructura para cumplir con el tipo 'DueMonth' que pide el error
interface DueMonth {
    name: string;
    date: string;
}

// Calcula los meses que se deben
export const getMonthsDue = (paymentDate: Date, paidMonths: string[] = []): DueMonth[] => {
    const today = new Date();
    const startDate = new Date(paymentDate);
    // Ajustamos al final del día para evitar problemas de zona horaria
    today.setHours(0, 0, 0, 0);
    const dueDates: DueMonth[] = [];

    // Parseamos la fecha de instalación (asumiendo YYYY-MM-DD)
    const [year, month, day] = [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()];
    // Empezamos a iterar desde la fecha de instalación
    // eslint-disable-next-line prefer-const
    let currentCheckDate = new Date(year, month - 1, day);
    // Mientras la fecha a chequear sea menor o igual a hoy
    while (currentCheckDate <= today) {
        // Formato YYYY-MM-DD para comparar con lo que viene de la BD
        const dateString = currentCheckDate.toISOString().split('T')[0];
        // Lógica de Gracia: 5 días
        const gracePeriodLimit = new Date(currentCheckDate);
        gracePeriodLimit.setDate(gracePeriodLimit.getDate() + 5);
        // Si NO está pagado
        if (!paidMonths.includes(dateString)) {
            // Y ya pasó la fecha de gracia
            if (today > gracePeriodLimit) {
                const monthName = currentCheckDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
                dueDates.push({
                    date: dateString,
                    name: `Mes de ${monthName}`
                });
            }
        }
        // Avanzar al siguiente mes
        currentCheckDate.setMonth(currentCheckDate.getMonth() + 1);
    }
    return dueDates;
};

// Determina el estado basado en si hay deuda
export const getPlanStatus = (dueMonths: DueMonth[]): PaymentStatus => {
    return dueMonths.length > 0 ? 'due' : 'paid';
};

export const getDetailedCurrentMonthStatus = (paymentDate: string | Date, paidMonths: string[] = []): DetailedStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(paymentDate);
    const paymentDay = startDate.getDate();
    // 1. Determinar la fecha de vencimiento para el ciclo actual
    const currentDueDate = new Date(today.getFullYear(), today.getMonth(), paymentDay);
    // Si hoy ya pasó el día de pago de este mes, el vencimiento es el de este mes.
    // Si no, el vencimiento que nos importa es el del mes pasado.
    if (today.getDate() < paymentDay) {
        currentDueDate.setMonth(currentDueDate.getMonth() - 1);
    }
    const dueDateString = currentDueDate.toISOString().split('T')[0];
    // 2. Verificar si el mes actual ya está pagado
    const normalizedPaidMonths = new Set(paidMonths.map(d => new Date(d).toISOString().split('T')[0]));
    if (normalizedPaidMonths.has(dueDateString)) {
        return { status: 'paid', message: 'Pagado a tiempo' };
    }
    // 3. Si no está pagado, determinar si está en gracia o vencido
    const gracePeriodLimit = new Date(currentDueDate);
    gracePeriodLimit.setDate(gracePeriodLimit.getDate() + 5);
    // Si hoy es posterior a la fecha de vencimiento pero anterior al límite de gracia
    if (today > currentDueDate && today <= gracePeriodLimit) {
        const timeDiff = gracePeriodLimit.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return {
            status: 'grace_period',
            message: `En período de gracia. Vence en ${daysRemaining} día(s).`,
            daysRemaining: daysRemaining
        };
    }
    // Si hoy ya pasó el límite del período de gracia
    if (today > gracePeriodLimit) {
        return { status: 'due', message: 'El pago de este mes está vencido.' };
    }
    // Si nada de lo anterior se cumple, significa que el pago aún no ha vencido
    return { status: 'upcoming', message: 'Pago al día. Próximo vencimiento el ' + dueDateString };
};

