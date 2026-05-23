export type MonthStatus = 'paid' | 'overdue' | 'future' | 'current';

export interface PaymentMonth {
    id: string;
    date: string;       // 'YYYY-MM-DD'
    name: string;      
    status: MonthStatus;
}

export const getAllPaymentMonths = (
    dayStaticPay: string,    // -->Ej: "2026-05-15"
    coveredUpToStr: string   // -->Ej: "2026-06-15"
): PaymentMonth[] => {
    const months: PaymentMonth[] = [];

    const [startYear, startMonth, startDay] = dayStaticPay.split('-').map(Number);
    const [covYear, covMonth] = coveredUpToStr.split('-').map(Number);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const coveredYm = covYear * 100 + covMonth;
    const currentYm = currentYear * 100 + currentMonth;

    let iterYear = startYear;
    let iterMonth = startMonth;

    // --> Límite: Mostrar hasta 6 meses a futuro desde el mes actual
    let limitMonth = currentMonth + 6;
    let limitYear = currentYear;
    if (limitMonth > 12) {
        limitYear += Math.floor((limitMonth - 1) / 12);
        limitMonth = (limitMonth % 12) || 12;
    }
    const limitYm = limitYear * 100 + limitMonth;

    const formatter = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' });

    while (iterYear * 100 + iterMonth <= limitYm) {
        const tempYm = iterYear * 100 + iterMonth;
        let status: MonthStatus = 'future';
        // --- NUEVA LÓGICA DE ESTADOS CORREGIDA ---
        if (tempYm < coveredYm) {
            // A. Si el mes es estrictamente MENOR al mes de vencimiento -> Ya está pagado
            status = 'paid';
        } else if (tempYm === coveredYm) {
            // B. Este es el mes donde vence su saldo (el mes "Por Pagar" o Activo)
            // Revisamos si ya se le pasó la fecha de corte para ver si es moroso
            if (tempYm < currentYm) {
                status = 'overdue';
            } else if (tempYm === currentYm && currentDate.getDate() > startDay) {
                // Si es el mes actual pero ya pasó el día del mes de su pago estático
                status = 'overdue';
            } else {
                status = 'current'; // Es el mes actual/vencimiento a tiempo
            }
        } else {
            // C. Si el mes es MAYOR al mes de vencimiento -> Es un mes futuro
            // Pero ojo: si el mes ya pasó en el calendario real, es moroso acumulado
            if (tempYm < currentYm) {
                status = 'overdue';
            } else {
                status = 'future';
            }
        }
        // Formatear display
        const dateObj = new Date(iterYear, iterMonth - 1, 15);
        const rawName = formatter.format(dateObj);
        const nameCapitalized = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const dateStr = `${iterYear}-${String(iterMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
        months.push({
            id: `${iterYear}-${String(iterMonth).padStart(2, '0')}`,
            date: dateStr,
            name: nameCapitalized,
            status
        });
        iterMonth++;
        if (iterMonth > 12) {
            iterMonth = 1;
            iterYear++;
        }
    }
    return months;
};