
export function calculateHour (tariff, hourEntry) {
    let hour = new Date(hourEntry.utcHour).getHours();
    return tariff.rates_monthly[0].calculate(hour, 0, hourEntry.kwh) / 100;
}
