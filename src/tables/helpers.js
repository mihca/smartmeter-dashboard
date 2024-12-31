
export function findBestTariff (tariffs, prices, bestFunction) {
    const price = bestFunction(...prices.filter(value => !isNaN(value)));
    for (let idx = 0; idx < tariffs.length; idx ++) {
        if (prices[idx] === price) return ({
            price: price, 
            tariff: tariffs[idx]
        });
    }
    return null;
}

export function monthOptions (pdr) {
    let months = [{key: 0, label: "Gesamt"}];
    let startDate = new Date(pdr.utcHourFrom);
    let endDate = new Date(pdr.utcHourTo);
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

export function highlightBestPrice (price, prices, lastLine, minColor, maxColor) {
    let fontStyle = "font-light";
    if (lastLine) fontStyle = "font-bold";
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    // const idx = Math.round ((price - min) / (max - min) * 4) + 1;
    // const fontColor = "text-yellow-" + idx + "00";
    let fontColor = "text-gray-100";
    if (price == min) fontColor = minColor;
    if (price == max) fontColor = maxColor;
    const result = fontColor + " " + fontStyle;

    // console.log (price, min, max, idx, result);
    return result;
}
