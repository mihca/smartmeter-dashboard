import { format } from "date-fns";
import { calculateHour, calculateNetfee, addVat } from "../tariff-calculator/calculator";

export function simulateStorage (usagePDR, feedinPDR, mdr, selectedStorageSize, selectedChargingLoss, selectedUsageTariff, selectedNetfees, selectedFeedinTariff) {
    const lineData = [];

    if (!usagePDR || !feedinPDR) 
        return lineData;
        
    const usageHourData = usagePDR.hourData;
    const feedinHourData = feedinPDR.hourData;
    const capacity = Number(selectedStorageSize);
    const loss = Number(selectedChargingLoss);
     
    let groupId = 0;
    let groupChange = (date, groupId) => date.getMonth() != groupId;
    let lineCounter = 0;
    
    let lineDatePattern = "yyyy-MM";
    let sumKwhUsage = 0.0;
    let sumKwhFeedin = 0.0;
    let sumKwhCharged = 0.0;
    let sumKwhDischarged = 0.0;
    let sumSoc = 0.0;
    let sumEurProfit = 0.0;

    let overallKwhUsage = 0.0;
    let overallKwhFeedin = 0.0;
    let overallKwhCharged = 0.0;
    let overallKwhDischarged = 0.0;
    let overallEurProfit = 0.0;

    let soc = 0.0;

    usageHourData.forEach((usageHourEntry, idx, array) => {

        const kwhUsage = usageHourEntry.kwh;
        const kwhFeedin = feedinHourData[idx].kwh;
        const marketPrice = mdr.hourMap.get(usageHourEntry.utcHour-3600000)
        let eurProfit = 0.0;
    
        // Charge storage
        let kwhCharged = 0;

        if (kwhFeedin > 0) {
            // We have kwh left to charge the storage
            const [kwh, socAfterCharging] = chargeStorage(capacity, loss, soc, kwhFeedin);
            const eurFeedinLost = calculateHour (selectedFeedinTariff, kwh, usageHourEntry.utcHour, marketPrice);
            soc = socAfterCharging;
            kwhCharged = kwh;
            eurProfit -= eurFeedinLost;
        }

        // Discharge storage
        let kwhDischarged = 0;

        if (kwhUsage > 0 && soc > 0) {
            // We need kwh and storage is charged
            const [kwh, socAfterDischarging] = dischargeStorage (loss, soc, kwhUsage) 
            let eurUsageSaved = calculateHour (selectedUsageTariff, kwh, usageHourEntry.utcHour, marketPrice);
            if (selectedNetfees) eurUsageSaved += calculateNetfee (selectedNetfees, 0, kwh);
            eurUsageSaved += addVat (eurUsageSaved);
            soc = socAfterDischarging;
            kwhDischarged = kwh;
            eurProfit += eurUsageSaved;
        }

        sumKwhUsage += kwhUsage;
        sumKwhFeedin += kwhFeedin;
        sumKwhCharged += kwhCharged;
        sumKwhDischarged += kwhDischarged;
        sumEurProfit += eurProfit;
        sumSoc += soc;
        lineCounter += 1;

        // Change of day or month
        if (groupChange(new Date(usageHourEntry.utcHour), groupId) || (idx === array.length - 1)) {

            const endDate = new Date(array[idx-1].utcHour);

            lineData.push({
                date: format(endDate, lineDatePattern),
                usedKwh: sumKwhUsage,
                feedinKwh: sumKwhFeedin,
                chargedKwh: sumKwhCharged,
                dischargedKwh: sumKwhDischarged,
                socKwh: sumSoc/lineCounter,
                socPercent: sumSoc/lineCounter/selectedStorageSize,
                eurProfit: sumEurProfit
            });

            overallKwhUsage += sumKwhUsage;
            overallKwhFeedin += sumKwhFeedin;
            overallKwhCharged += sumKwhCharged;
            overallKwhDischarged += sumKwhDischarged;
            overallEurProfit += sumEurProfit;

            sumKwhUsage = 0.0;
            sumKwhFeedin = 0.0;
            sumKwhCharged = 0.0;
            sumKwhDischarged = 0.0;
            sumEurProfit = 0.0;
            sumSoc = 0.0;
            lineCounter = 0;
            groupId += 1;        
        }
    })

    lineData.push({
        date: "Gesamt",
        usedKwh: overallKwhUsage,
        feedinKwh: overallKwhFeedin,
        chargedKwh: overallKwhCharged,
        dischargedKwh: overallKwhDischarged,
        socKwh: NaN,
        socPercent: NaN,
        eurProfit: overallEurProfit
    });

    return lineData;
}

// capacity=7 means 7 kWh storage
// loss=10 means 10%
// soc=10 means 10 kWh loaded in storage
function chargeStorage (capacity, loss, soc, kwh) {

    let kwhNetCharge = kwh * (1 - loss / 100);
    let kwhCharged = 0.0;
    if (soc + kwhNetCharge > capacity) {
        // Storage fully charged, not all kwh charged
        kwhCharged = (capacity - soc) * (1 + loss / 100);
        soc = capacity;
    } else {
        // Charged all kwh
        soc = soc + kwhNetCharge;
        kwhCharged = kwh;
    }

    return [
        kwhCharged,
        soc
    ]

}

// loss=10 means 10%
// soc=10 means 10 kWh loaded in storage
function dischargeStorage (loss, soc, kwh) {
    
    // Assume all kwh can be taken from storage
    let kwhGrossCharge = kwh * (1 + loss / 100);
    soc -= kwhGrossCharge;
    let kwhGot = kwh;

    if (soc < 0) {
        // Uups, storage is empty, not all kwh could be taken: Take all you get minus loss
        kwhGot = soc * (1 - loss / 100);
        soc = 0;
    }
    
    return [
        kwhGot,
        soc
    ]
}