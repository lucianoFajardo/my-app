
export function formatDateRangeAction(dateRange: string) {
    const [startDay] = dateRange.split("-")
    const today = new Date();
    const returnData = new Date(today.getFullYear(), today.getMonth() , parseInt(startDay.trim()));
    console.log("Formatted Date:", returnData.getDate());
    return returnData.toISOString().slice(0, 10); // formato YYYY-MM-DD
}

// TODO --> Seguir aqui solucionar el tema de cambiar las fechas de pago