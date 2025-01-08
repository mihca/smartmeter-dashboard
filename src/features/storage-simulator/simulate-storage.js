import { format } from "date-fns";

export function simulateStorage (usagePDR, feedinPDR, mdr, selectedStorageSize, selectedChargingLoss, selectedUsageTariff, selectedNetfees, selectedFeedinTariff) {
    const lineData = [];

    console.log("storageSize", selectedStorageSize);
    console.log("chargingLoss", selectedChargingLoss);
    console.log("usageTariff", selectedUsageTariff);
    console.log("netfees", selectedNetfees);
    console.log("feedinTariff", selectedFeedinTariff);
    
    if (usagePDR && feedinPDR) {
        
        const usageHourData = usagePDR.hourData;
        const feedinHourData = feedinPDR.hourData;
        let socKwh = 0.0;
        
        usageHourData.forEach((usageHourEntry, idx, array) => {

            const date = new Date (usageHourEntry.utcHour);
            const usedKwh = usageHourEntry.kwh;
            const feedinKwh = feedinHourData[idx].kwh;

            const { kwhLeftForFeedin, socKwhAfterCharging} = chargeStorage(selectedStorageSize, selectedChargingLoss, socKwh, feedinKwh);
            const { kwhLeftForUsage, socKwhAfterRecharging}= dischargeStorage(selectedStorageSize, selectedChargingLoss, socKwh, usedKwh);
            
            lineData.push({
                date: format(date, "yyyy-MM-dd HH:mm"),
                chargedKwh: feedinHourData[idx].kwh,
                dischargedKwh: usageHourEntry.kwh,
                socKwh: 0.1,
                socPercent: 0.1,
                eurSaved: 0.30
            });
        })
    }

    return lineData;
}

function chargeStorage (storageSize, chargingLoss, kwh) {
    return kwh;
}

function dischargeStorage (storageSize, chargingLoss, kwh) {
    return kwh;
}