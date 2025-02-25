import { round1Digit, round2Digits, round3Digits, formatEUR, formatCt } from "../../scripts/round.js";
import { format } from "date-fns";
import { NETFEES } from "../../data/netfees.js";

export const VAT_RATE = 20;

export function calculateTariffsTable (tariffs, pdr, mdr, monthOption, withBasefee, withVat, selectedNetfeesIdx) {

    const marketHourMap = mdr.hourMap;

    let lineData = [];
    let lineHourCounter = 0;
    let lineSumKwh = 0.0;
    let lineMarketPriceCtSum = 0.0;
    let linePriceCtSumWeighted = 0.0;
    let lineTariffPriceSum = new Array(tariffs.length).fill(0.0);

    let overallSumKwh = 0.0;
    let overallMarketPriceSum = 0.0;
    let overallMarketPriceSumWeighted = 0.0;
    let overallTariffPriceSum = new Array(tariffs.length).fill(0.0);

    let hourData = pdr.hourData;
    
    // This is the default for the grouping by month
    let groupId = 0;
    let groupChange = (date, groupId) => date.getMonth() != groupId;
    let lineDatePattern = "yyyy-MM";

    // Here comes the grouping by day
    if (monthOption > 0) {
        // Exclude 1. at 0:00, because its the sum from the last hour of the last month
        hourData = hourData.filter( (hourEntry) => 
            new Date (hourEntry.utcHour).getMonth() === (monthOption-1) && 
            !(new Date (hourEntry.utcHour).getDate() === 1 && new Date (hourEntry.utcHour).getHours() === 0)
        );
        groupChange = (date, groupId) => date.getDate() != groupId;
        groupId = 1;
        lineDatePattern = "yyyy-MM-dd";
    }

    hourData.forEach((hourEntry, idx, array) => {

        lineHourCounter = lineHourCounter + 1;
        lineSumKwh += hourEntry.kwh;
        
        let marketPriceCt = marketHourMap.get(hourEntry.utcHour-3600000);
        lineMarketPriceCtSum += marketPriceCt;
        linePriceCtSumWeighted += marketPriceCt * hourEntry.kwh;

        // Calculate tariffs
        tariffs.forEach((tariff, idx) => {
            lineTariffPriceSum[idx] += calculateHour (tariff, hourEntry.kwh, hourEntry.utcHour, marketHourMap.get(hourEntry.utcHour-3600000));
        })

        // Change of day or month
        if (groupChange(new Date(hourEntry.utcHour), groupId) || (idx === array.length - 1)) {

            // Add vat and fees if wanted
            const endDate = new Date(array[idx-1].utcHour);
            let days = (monthOption == 0) ? endDate.getDate() : 1;
            let bills = [];

            tariffs.forEach((tariff, idx) => {
                let bill = [{item: "Energiepreis", value: formatEUR (lineTariffPriceSum[idx])}];
                let netPrice = lineTariffPriceSum[idx];
                lineTariffPriceSum[idx] += withBasefee ? calculateBasefee(tariff, endDate, monthOption, bill) : 0;
                lineTariffPriceSum[idx] += selectedNetfeesIdx > 0 ? calculateNetfee(NETFEES[selectedNetfeesIdx-1], days, lineSumKwh, bill) : 0;
                lineTariffPriceSum[idx] += withVat ? vat(lineTariffPriceSum[idx], bill) : 0;
                bill.push ({item: "Gesamtpreis", value: formatEUR (lineTariffPriceSum[idx]), className:"divide-y divide-gray-700"});
                if (selectedNetfeesIdx > 0) {
                    const grundpreis = calculateGrundpreis(tariff, NETFEES[selectedNetfeesIdx-1], endDate, monthOption, days, withVat);
                    bill.push ({item: "Grundpreis/Monat", value: formatEUR (grundpreis), className: "text-xs py-1"});
                    const arbeitspreis = calculatePricePerAdditionalKwh(NETFEES[selectedNetfeesIdx-1], netPrice / lineSumKwh, withVat);
                    bill.push ({item: "Arbeitspreis/kWh", value: formatCt (arbeitspreis), className: "text-xs py-1"});
                }
                bills.push(bill);
            })

            lineData.push ({
                date: format(endDate, lineDatePattern),
                kwh: round3Digits(lineSumKwh),
                averageMarketPricePerKwh: round3Digits (lineMarketPriceCtSum / lineHourCounter),
                weightedMarketPricePerKwh: round3Digits (linePriceCtSumWeighted / lineSumKwh),
                tariffPricesEUR: lineTariffPriceSum,
                priceInfo: bills
            });
            
            overallSumKwh += lineSumKwh;
            overallMarketPriceSum += lineMarketPriceCtSum;
            overallMarketPriceSumWeighted += linePriceCtSumWeighted;
            for (let t = 0; t<tariffs.length; t++) {
                overallTariffPriceSum[t] += lineTariffPriceSum[t];
            };
    
            lineHourCounter = 0;
            lineSumKwh = 0.0;
            lineTariffPriceSum = new Array(tariffs.length).fill(0.0);
            lineMarketPriceCtSum = 0.0;
            linePriceCtSumWeighted = 0.0;
            groupId += 1;
        }
    });

    lineData.push ({
        date: "Gesamt",
        kwh: overallSumKwh,
        averageMarketPricePerKwh: round3Digits (overallMarketPriceSum / hourData.length),
        weightedMarketPricePerKwh: round3Digits (overallMarketPriceSumWeighted / overallSumKwh),
        tariffPricesEUR: overallTariffPriceSum,
        priceInfo: []
    });

    return lineData;
}

export function calculateFeedinTable (tariffs, pdr, mdr, monthOption, withBasefee) {

    const marketHourMap = mdr.hourMap;

    let lineData = [];
    let lineHourCounter = 0;
    let lineSumKwh = 0.0;
    let lineMarketPriceCtSum = 0.0;
    let linePriceCtSumWeighted = 0.0;
    let lineTariffPriceSum = new Array(tariffs.length).fill(0.0);

    let overallSumKwh = 0.0;
    let overallMarketPriceSum = 0.0;
    let overallMarketPriceSumWeighted = 0.0;
    let overallTariffPriceSum = new Array(tariffs.length).fill(0.0);

    let hourData = pdr.hourData;
    
    // This is the default for the grouping by month
    let groupId = 0;
    let groupChange = (date, groupId) => date.getMonth() != groupId;
    let lineDatePattern = "yyyy-MM";

    // Here comes the grouping by day
    if (monthOption > 0) {
        // Exclude 1. at 0:00, because its the sum from the last hour of the last month
        hourData = hourData.filter( (hourEntry) => 
            new Date (hourEntry.utcHour).getMonth() === (monthOption-1) && 
            !(new Date (hourEntry.utcHour).getDate() === 1 && new Date (hourEntry.utcHour).getHours() === 0)
        );
        groupChange = (date, groupId) => date.getDate() != groupId;
        groupId = 1;
        lineDatePattern = "yyyy-MM-dd";
    }

    hourData.forEach((hourEntry, idx, array) => {

        lineHourCounter = lineHourCounter + 1;
        lineSumKwh += hourEntry.kwh;
        
        let marketPriceCt = marketHourMap.get(hourEntry.utcHour-3600000);
        lineMarketPriceCtSum += marketPriceCt;
        linePriceCtSumWeighted += marketPriceCt * hourEntry.kwh;

        // Calculate price for each tariff
        tariffs.forEach((tariff, tdx) => {
            lineTariffPriceSum[tdx] += calculateHour (tariff, hourEntry.kwh, hourEntry.utcHour, marketHourMap.get(hourEntry.utcHour-3600000));
        })

        // Change of day or month
        if (groupChange(new Date(hourEntry.utcHour), groupId) || (idx === array.length - 1)) {

            // Add basefee if wanted
            const endDate = new Date(array[idx-1].utcHour);

            tariffs.forEach((tariff, idx) => {
                lineTariffPriceSum[idx] -= withBasefee ? calculateBasefee(tariff, endDate, monthOption) : 0;
            })

            lineData.push ({
                date: format(endDate, lineDatePattern),
                kwh: round3Digits(lineSumKwh),
                averageMarketPricePerKwh: round3Digits (lineMarketPriceCtSum / lineHourCounter),
                weightedMarketPricePerKwh: round3Digits (linePriceCtSumWeighted / lineSumKwh),
                tariffPricesEUR: lineTariffPriceSum,
            });

            
            overallSumKwh += lineSumKwh;
            overallMarketPriceSum += lineMarketPriceCtSum;
            overallMarketPriceSumWeighted += linePriceCtSumWeighted;
            for (let t = 0; t<tariffs.length; t++) {
                overallTariffPriceSum[t] += lineTariffPriceSum[t];
            };
    
            lineHourCounter = 0;
            lineSumKwh = 0.0;
            lineTariffPriceSum = new Array(tariffs.length).fill(0.0);
            lineMarketPriceCtSum = 0.0;
            linePriceCtSumWeighted = 0.0;
            groupId += 1;
        }
    });

    lineData.push ({
        date: "Gesamt",
        kwh: overallSumKwh,
        averageMarketPricePerKwh: round3Digits (overallMarketPriceSum / hourData.length),
        weightedMarketPricePerKwh: round3Digits (overallMarketPriceSumWeighted / overallSumKwh),
        tariffPricesEUR: overallTariffPriceSum,
    });

    return lineData;
}

// returns EUR
export function calculateHour (tariff, kwh, utcHour, marketPrice) {
    const date = new Date(utcHour);
    // Consumption and feedin values are at the end of each hour, prices are at the beginning
    // For ex.: 01.12.2023 00:00 will take the tariff price of 30.11.2023 23:00
    date.setHours(date.getHours() - 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const weekday = date.getDay();
    const hour = date.getHours();
    const priceEUR = tariff.calculate(year, month, weekday, hour, marketPrice, kwh) / 100.0;
    return priceEUR;
}

// returns EUR
// hack: days maybe 0, 1, 28, 29, 30, 31
// 0=hour
// 1=1 day
// ...=whole month
export function calculateNetfee(netfee, days, kwh, bill=undefined) { 
    // Seems that netfees are calculated always for 365 days and therefore February counts always 28 days
    if (days == 29) days = 28;
    let feePerDay = round2Digits( days * netfee.netfee_per_day_ct / 100 );
    // Handle per hour
    if (days == 0) feePerDay = round2Digits( netfee.netfee_per_day_ct / 24 / 100 );
    const feePerKwh = round2Digits( round1Digit(kwh) * netfee.netfee_per_kwh_ct / 100 );
    const fee = feePerDay + feePerKwh ;
    if (bill) bill.push ({item: "Netzgebühren nach Zeit", value: formatEUR (feePerDay)});
    if (bill) bill.push ({item: "Netzgebühren nach Verbrauch", value: formatEUR (feePerKwh)});
    return fee;
}

// returns EUR
// monthOption=0 => Whole month for overall view
// monthOption>0 => One day in dedicated month (January, ...)
function calculateBasefee(tariff, date, monthOption, bill=undefined) {
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
    if (bill) bill.push ({item: "Grundgebühr", value: formatEUR (basefee)})
    return round2Digits(basefee);
}

export function vat(amount, bill=undefined) {
    let vat = amount * VAT_RATE / 100;
    if (bill) bill.push ({item: "MwSt " + VAT_RATE + "%" , value: formatEUR (vat)});
    return vat;
}

export function findBestTariff (tariffs, prices, bestFunction) {
    const price = bestFunction(...prices.filter(value => !isNaN(value)));
    for (let idx = 0; idx < tariffs.length; idx ++) {
        if (! isNaN(prices[idx]) && prices[idx] === price) return ({
            price: price, 
            tariff: tariffs[idx]
        });
    }
    return null;
}

// Use 1 for January, 2 for February, etc.
function daysInMonth (date) { 
    return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
}

function calculatePricePerAdditionalKwh (netfee, averageNetPriceEur, withVat) {
    let priceCt = averageNetPriceEur * 100 + netfee.netfee_per_kwh_ct;
    if (withVat) {
        priceCt += vat(priceCt);
    }
    return priceCt;
}

function calculateGrundpreis (tariff, netfee, date, monthOption, days, withVat) {
    let netfeeEur = calculateNetfee(netfee, days, 0);
    let basefeeEur = calculateBasefee(tariff, date, monthOption);
    let priceEur = basefeeEur + netfeeEur;
    if (withVat) {
        priceEur += vat(priceEur);
    }
    return priceEur;
}
