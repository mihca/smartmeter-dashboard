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
            const kwhUsed = usageHourEntry.kwh;
            const kwhFedin = feedinHourData[idx].kwh;

            const { kwhCharged, kwhNotCharged, socKwhAfterCharging } = chargeStorage(selectedStorageSize, selectedChargingLoss, socKwh, kwhFedin);
            const { kwhDischarged, socKwhAfterDischarging }= dischargeStorage(selectedStorageSize, selectedChargingLoss, socKwhAfterCharging, kwhUsed);

            socKwh = socKwhAfterDischarging;
            
            lineData.push({
                date: format(date, "yyyy-MM-dd HH:mm"),
                usedKwh: kwhUsed,
                feedinKwh: kwhFedin,
                chargedKwh: kwhCharged,
                dischargedKwh: kwhDischarged,
                socKwh: socKwh,
                socPercent: socKwh / selectedStorageSize,
                eurSaved: 0.0
            });
        })
    }

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