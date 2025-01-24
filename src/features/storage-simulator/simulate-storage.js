import { format } from "date-fns";
import { calculateHour, calculateNetfee, vat } from "../tariff-calculator/calculator";

export function simulateStorage (consumptionPDR, feedinPDR, mdr, selectedStorageSize, selectedChargingLoss, selectedConsumptionTariff, selectedNetfees, selectedFeedinTariff) {
    const lineData = [];

    if (!consumptionPDR || !feedinPDR) 
        return lineData;
        
    const consumptionHourData = consumptionPDR.hourData;
    const feedinHourData = feedinPDR.hourData;
    const capacity = Number(selectedStorageSize);
    const loss = Number(selectedChargingLoss);
     
    let groupId = 0;
    let groupChange = (date, groupId) => date.getMonth() != groupId;
    let lineDatePattern = "yyyy-MM";
    //let groupId = 1;
    //let groupChange = (date, groupId) => date.getDay() != groupId;
    //let lineDatePattern = "yyyy-MM-dd";
    let lineCounter = 0;
    
    let sumKwhConsumption = 0.0;
    let sumKwhConsumptionNew = 0.0;
    let sumKwhFeedin = 0.0;
    let sumKwhCharged = 0.0;
    let sumKwhDischarged = 0.0;
    let sumSoc = 0.0;
    let sumEurProfit = 0.0;

    let overallKwhConsumption = 0.0;
    let overallKwhConsumptionNew = 0.0;
    let overallKwhFeedin = 0.0;
    let overallKwhCharged = 0.0;
    let overallKwhDischarged = 0.0;
    let overallEurProfit = 0.0;

    let soc = 0.0;

    consumptionHourData.forEach((consumptionHourEntry, idx, array) => {

        const kwhConsumption = consumptionHourEntry.kwh;
        const kwhFeedin = feedinHourData[idx].kwh;
        const marketPrice = mdr.hourMap.get(consumptionHourEntry.utcHour-3600000)
        let eurProfit = 0.0;
        let kwhConsumptionNew = kwhConsumption;
    
        // Charge storage
        let kwhCharged = 0;
        let eurFeedinLost = 0;
        let eurConsumptionSaved = 0;

        if (kwhFeedin > 0) {
            // We have kwh left to charge the storage
            const [kwh, socAfterCharging] = chargeStorage(capacity, loss, soc, kwhFeedin);
            eurFeedinLost = calculateHour (selectedFeedinTariff, kwh, consumptionHourEntry.utcHour, marketPrice);
            soc = socAfterCharging;
            kwhCharged = kwh;
            eurProfit -= eurFeedinLost;
        }

        // Discharge storage
        let kwhDischarged = 0;

        if (kwhConsumption > 0 && soc > 0) {
            // We need kwh and storage is charged
            const [kwh, socAfterDischarging] = dischargeStorage (loss, soc, kwhConsumption) 
            eurConsumptionSaved = calculateHour (selectedConsumptionTariff, kwh, consumptionHourEntry.utcHour, marketPrice);
            if (selectedNetfees) eurConsumptionSaved += calculateNetfee (selectedNetfees, 0, kwh);
            eurConsumptionSaved += vat (eurConsumptionSaved);
            soc = socAfterDischarging;
            kwhDischarged = kwh;
            eurProfit += eurConsumptionSaved;
            kwhConsumptionNew = kwhConsumption - kwhDischarged;
        }

        // console.log(new Date(consumptionHourEntry.utcHour), "verbraucht: "+kwhConsumption.toFixed(2), "einspeist: "+kwhFeedin.toFixed(2), "laden: "+kwhCharged.toFixed(2), "entladen: "+kwhDischarged.toFixed(2), "soc: "+soc.toFixed(2), "verloren: "+eurFeedinLost.toFixed(2), "gespart: "+eurConsumptionSaved.toFixed(2));

        sumKwhConsumption += kwhConsumption;
        sumKwhConsumptionNew += kwhConsumptionNew;
        sumKwhFeedin += kwhFeedin;
        sumKwhCharged += kwhCharged;
        sumKwhDischarged += kwhDischarged;
        sumEurProfit += eurProfit;
        sumSoc += soc;
        lineCounter += 1;

        // Change of day or month
        if (groupChange(new Date(consumptionHourEntry.utcHour), groupId) || (idx === array.length - 1)) {

            const endDate = new Date(array[idx-1].utcHour);

            lineData.push({
                date: format(endDate, lineDatePattern),
                usedKwh: sumKwhConsumption,
                usedKwhNew: sumKwhConsumptionNew,
                feedinKwh: sumKwhFeedin,
                chargedKwh: sumKwhCharged,
                dischargedKwh: sumKwhDischarged,
                socKwh: sumSoc/lineCounter,
                socPercent: sumSoc/lineCounter/selectedStorageSize,
                eurProfit: sumEurProfit
            });

            overallKwhConsumption += sumKwhConsumption;
            overallKwhConsumptionNew += sumKwhConsumptionNew;
            overallKwhFeedin += sumKwhFeedin;
            overallKwhCharged += sumKwhCharged;
            overallKwhDischarged += sumKwhDischarged;
            overallEurProfit += sumEurProfit;

            sumKwhConsumption = 0.0;
            sumKwhConsumptionNew = 0.0;
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
        usedKwh: overallKwhConsumption,
        usedKwhNew: overallKwhConsumptionNew,
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
    
    let kwhGrossCharge = kwh * (1 + loss / 100);
    let kwhGot = 0;

    if (soc - kwhGrossCharge < 0) {
        // Uups, storage is empty, not all kwh could be taken: Take all you get minus loss
        kwhGot = soc * (1 - loss / 100);
        soc = 0;
    } else {
        kwhGot = kwh;
        soc -= kwhGrossCharge;
    }
    
    return [
        kwhGot,
        soc
    ]
}