
export function calculateHourEUR (tariff, hourEntry, marketPrice) {
    const date = new Date(hourEntry.utcHour);
    const year = date.getFullYear();
    const month = date.getMonth();
    const weekday = date.getDay();
    const hour = date.getHours();
    return tariff.calculate(year, month, weekday, hour, marketPrice, hourEntry.kwh) / 100;
}
