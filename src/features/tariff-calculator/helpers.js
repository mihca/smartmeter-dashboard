import { formatEUR } from "../../scripts/round.js";
import { VAT_RATE } from "./calculator.js";

export function monthOptions (pdr) {
    let months = [{key: 0, label: "Gesamt"}];
    let startDate = new Date(pdr.utcHourFrom);
    let endDate = new Date(pdr.utcHourTo-3600000);
    endDate.setDate(1);
    let date = endDate;

    while (date.getMonth() >= startDate.getMonth() && date.getFullYear() == startDate.getFullYear()) {
        months.push ({
            key: date.getMonth() + 1,
            label: date.toLocaleString('default', { year: 'numeric', month: 'long' })
        });
        date.setMonth(date.getMonth() - 1);
    }
    
    return months;
}

export function title (pdr, monthOption, topic) {
    if (monthOption == 0) {
        return topic + " Gesamt";
    } else {
        let date = new Date(pdr.utcHourFrom)
        date.setMonth(monthOption-1);
        return date.toLocaleString('default', { year: 'numeric', month: 'long' });
    }
}

export function highlightBestPrice (price, prices, lastLine, bestColor, bestFunction) {
    let fontStyle = "font-light";
    if (lastLine) fontStyle = "font-bold";
    
    const bestPrice = bestFunction(...prices.filter(value => !isNaN(value)));
    let fontColor = "text-gray-100";
    if (price == bestPrice) fontColor = bestColor;
    return fontColor + " " + fontStyle;
}

export function formatBasefee (tariff) {
    if (tariff.base_fee_monthly_eur) {
        return formatEUR(tariff.base_fee_monthly_eur*(100+VAT_RATE)/100);
    } else {
        return formatEUR(tariff.base_fee_yearly_eur/12*(100+VAT_RATE)/100);
    }
}
