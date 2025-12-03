import { PaymentStatus } from "../models/client-model";

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

