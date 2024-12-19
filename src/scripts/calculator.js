import { round1Digit, round2Digits, formatEUR } from "../scripts/round.js";

// returns EUR
export function calculateHour (tariff, hourEntry, marketPrice) {
    const date = new Date(hourEntry.utcHour);
    const year = date.getFullYear();
    const month = date.getMonth();
    const weekday = date.getDay();
    const hour = date.getHours();
    const kwh = hourEntry.kwh;
    return tariff.calculate(year, month, weekday, hour, marketPrice, kwh) / 100.0;
}

// returns EUR
export function calculateNetfee(netfee, days, kwh, bill) { 
    // Seems that netfees are calculated always for 365 days and therefore February counts always 28 days
    if (days == 29) days = 28;
    const feePerDay = round2Digits( days * netfee.netfee_per_day_ct / 100 );
    const feePerKwh = round2Digits( round1Digit(kwh) * netfee.netfee_per_kwh_ct / 100 );
    const taxPerKwh = round2Digits( kwh * netfee.tax_per_kwh_ct / 100 );
    const fee = feePerDay + feePerKwh + taxPerKwh;
    bill.push ({item: "Netzgebühren", value: formatEUR (feePerDay + feePerKwh)});
    bill.push ({item: "Abgaben", value: formatEUR (taxPerKwh)});
    return fee;
}

// returns EUR
// monthOption=0 => Whole month for overall view
// monthOption>0 => One day in dedicated month (January, ...)
export function calculateBasefee(tariff, date, monthOption, bill) {
    let basefee = 0.0;
    if (monthOption == 0) {
        // Calculate for whole month with number of days
        if (tariff.base_fee_monthly_eur) {
            basefee = tariff.base_fee_monthly_eur;
        }
        if (tariff.base_fee_yearly_eur) {
            basefee = tariff.base_fee_yearly_eur/365*daysInMonth(date);
        }
    } else {
        // Calculate for one day: Need to know all days in month
        if (tariff.base_fee_monthly_eur) {
            basefee = tariff.base_fee_monthly_eur/daysInMonth(date);
        }
        if (tariff.base_fee_yearly_eur) {
            basefee = tariff.base_fee_yearly_eur/365;
        }
    }
    bill.push ({item: "Grundgebühr", value: formatEUR (basefee)})
    return round2Digits(basefee);
}

export function addVat(vatRate, amount, bill) {
    let vat = amount * vatRate / 100;
    bill.push ({item: "MwSt " + vatRate + "%" , value: formatEUR (vat)});
    return vat;
}

// Use 1 for January, 2 for February, etc.
function daysInMonth (date) { 
    return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
}