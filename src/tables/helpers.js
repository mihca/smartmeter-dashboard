
export function monthOptions (pdr) {
    let months = [{key: 0, label: "Gesamt"}];
    let startDate = new Date(pdr.utcHourFrom);
    let endDate = new Date(pdr.utcHourTo);
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
