import { round2Digits } from "../scripts/round.js";

// returns EUR
export function calculateHour (tariff, hourEntry, marketPrice) {
    const date = new Date(hourEntry.utcHour);
    const year = date.getFullYear();
    const month = date.getMonth();
    const weekday = date.getDay();
    const hour = date.getHours();
    return round2Digits(tariff.calculate(year, month, weekday, hour, marketPrice, hourEntry.kwh) / 100.0);
}

// returns EUR
export function calculateNetfee(netfee, days, kwh) { 
    return round2Digits((days * netfee.netfee_per_day_ct + kwh * netfee.netfee_per_kwh_ct + kwh * netfee.tax_per_kwh_ct) / 100.0);
}

// returns EUR
// monthOption=0 => Whole month for overall view
// monthOption>0 => One day in dedicated month (January, ...)
export function calculateBasefee(tariff, date, monthOption) {
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
            basefee = tariff.base_fee_yearly_eur/365*daysInMonth(date);
        }
    }
    return round2Digits(basefee);
}

export function addTax(amount) {
    return amount * 0.2;
}

// Use 1 for January, 2 for February, etc.
function daysInMonth (date) { 
    return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
}