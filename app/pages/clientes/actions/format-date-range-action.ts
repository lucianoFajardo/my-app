
export function formatDateRangeAction(dateRange: string) {
    const [startDay] = dateRange.split("-")
    const today = new Date();
    const returnData = new Date(today.getFullYear(), today.getMonth() + 1, parseInt(startDay.trim()));
    console.log("Formatted Date:", returnData.getMonth);
    return returnData.toISOString().slice(0, 10); // formato YYYY-MM-DD
}