
export function calculateHour (tariff, hourEntry, marketPrice) {
    let hour = new Date(hourEntry.utcHour).getHours();
    return tariff.rates_monthly[0].calculate(hour, marketPrice, hourEntry.kwh) / 100;
}
