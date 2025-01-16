import { format } from "date-fns";
import { calculateHour, calculateNetfee, addVat } from "../tariff-calculator/calculator";

export function simulateStorage (usagePDR, feedinPDR, mdr, selectedStorageSize, selectedChargingLoss, selectedUsageTariff, selectedNetfees, selectedFeedinTariff) {
    const lineData = [];

    if (!usagePDR || !feedinPDR) 
        return lineData;
        
    const usageHourData = usagePDR.hourData;
    const feedinHourData = feedinPDR.hourData;
    const capacity = Number(selectedStorageSize);
    const ladeverluste = Number(selectedChargingLoss);
     
    let groupId = 0;
    let groupChange = (date, groupId) => date.getMonth() != groupId;
    let groupCounter = 0;
    let lineDatePattern = "yyyy-MM";
    let sumKwhUsage = 0.0;
    let sumKwhFeedin = 0.0;
    let sumKwhCharged = 0.0;
    let sumKwhDischarged = 0.0;
    let sumSoc = 0.0;
    let sumEurProfit = 0.0;

    let soc = 0.0;
    let gewinn_eur = 0.0;

    usageHourData.forEach((usageHourEntry, idx, array) => {

        const date = new Date (usageHourEntry.utcHour);
        const kwh_verbrauch = usageHourEntry.kwh;
        const kwh_einspeisung = feedinHourData[idx].kwh;
        const marketPrice = mdr.hourMap.get(usageHourEntry.utcHour-3600000)
    
        // Akku laden
        let kwh_ladung = 0;

        if (kwh_einspeisung > 0) {

            let kwh_ladung_netto = kwh_einspeisung * (1 - ladeverluste / 100);
            if (soc + kwh_ladung_netto > capacity) {
                // Akku voll
                kwh_ladung = (capacity - soc) * (1 + ladeverluste / 100);
                soc = capacity;
            } else {
                // Komplette Einspeisung in den Akku geladen
                soc = soc + kwh_ladung_netto;
                kwh_ladung = kwh_einspeisung;
            }

            const eur_nicht_erhalten = calculateHour (selectedFeedinTariff, kwh_ladung, usageHourEntry.utcHour, marketPrice);
            gewinn_eur = gewinn_eur - eur_nicht_erhalten
        }

        // Akku entladen
        let kwh_verbrauch_neu = kwh_verbrauch;
        let kwh_gespart = 0;

        if (kwh_verbrauch > 0 && soc > 0) {
            soc = soc - kwh_verbrauch;
            kwh_verbrauch_neu = 0;
            if (soc < 0) {
                kwh_verbrauch_neu = -soc;
                soc = 0;
            }
            kwh_gespart = kwh_verbrauch - kwh_verbrauch_neu;
            let eur_gespart = calculateHour (selectedUsageTariff, kwh_gespart, usageHourEntry.utcHour, marketPrice);
            eur_gespart += calculateNetfee (selectedNetfees, 0, kwh_gespart);
            eur_gespart += addVat (eur_gespart);
            gewinn_eur += eur_gespart;
        }

        sumKwhUsage += kwh_verbrauch;
        sumKwhFeedin += kwh_einspeisung;
        sumKwhCharged += kwh_ladung;
        sumKwhDischarged += kwh_gespart;
        sumEurProfit += gewinn_eur;
        sumSoc += soc;
        groupCounter += 1;

        // Change of day or month
        if (groupChange(new Date(usageHourEntry.utcHour), groupId) || (idx === array.length - 1)) {

            const endDate = new Date(array[idx-1].utcHour);

            lineData.push({
                date: format(endDate, lineDatePattern),
                usedKwh: sumKwhUsage,
                feedinKwh: sumKwhFeedin,
                chargedKwh: sumKwhCharged,
                dischargedKwh: sumKwhDischarged,
                socKwh: sumSoc/groupCounter,
                socPercent: sumSoc/groupCounter/selectedStorageSize,
                eurSaved: gewinn_eur
            });

            sumKwhUsage = 0.0;
            sumKwhFeedin = 0.0;
            sumKwhCharged = 0.0;
            sumKwhDischarged = 0.0;
            sumEurProfit = 0.0;
            sumSoc = 0.0;
            groupCounter = 0;
            groupId += 1;        
        }
    })

    return lineData;
}

function chargeStorage (storageSize, chargingLoss, socKwh, availableGrossKwh) {
    // money loss, because no feedin
    if (availableGrossKwh === 0) {
        return {
            kwhCharged: 0,
            kwhNotCharged: 0,
            socKwhAfterCharging: socKwh
        }
    }

    const availableNetKwh = availableGrossKwh * (1 - chargingLoss / 100.0);
    
    if (socKwh + availableNetKwh > storageSize) {
        // storage fully charged, cacluate the left gross kwh
        const kwhGrossUsed = (storageSize - socKwh) * (1 + chargingLoss / 100.0);
        console.log("Lade Akku mit ", kwhGrossUsed);
        return {
            kwhCharged: kwhGrossUsed,
            kwhNotCharged: availableGrossKwh - kwhGrossUsed,
            socKwhAfterCharging: storageSize
        }
    } else {
        // charge all kwh to storage
        console.log("Lade Akku mit ", availableGrossKwh);
        return {
            kwhCharged: availableGrossKwh,
            kwhNotCharged: 0,
            socKwhAfterCharging: socKwh + availableNetKwh
        }
    }
}

function dischargeStorage (storageSize, chargingLoss, socKwh, neededNetKwh) {
    // save money because net usage is reduced
    if (socKwh === 0 || neededNetKwh === 0) {
        console.log("Brauch nix aus dem Akku oder Akku leer");
        return {
            kwhDischarged: 0,
            socKwhAfterDischarging: 0
        }
    }

    const neededGrossKwh = neededNetKwh * (1 + chargingLoss / 100.0);

    if (socKwh >= neededGrossKwh) {
        console.log("Entlade ", neededGrossKwh);
        return {
            kwhDischarged: neededGrossKwh,
            socKwhAfterDischarging: socKwh - neededGrossKwh
        }
    } else {
        console.log("Entlade ", socKwh * (1 - chargingLoss / 100.0));
        return {
            kwhDischarged: socKwh * (1 - chargingLoss / 100.0),
            socKwhAfterDischarging: 0
        }
    }
}