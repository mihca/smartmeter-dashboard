import { format } from "date-fns";
import { calculateHour, calculateNetfee, addVat } from "../tariff-calculator/calculator";

export function simulateStorage (usagePDR, feedinPDR, mdr, selectedStorageSize, selectedChargingLoss, selectedUsageTariff, selectedNetfees, selectedFeedinTariff) {
    const lineData = [];

    if (usagePDR && feedinPDR) {
        
        const usageHourData = usagePDR.hourData;
        const feedinHourData = feedinPDR.hourData;
        const capacity = Number(selectedStorageSize);
        const ladeverluste = Number(selectedChargingLoss);
        let soc = 0.0;
        let kohle_eur = 0.0;
        
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

                const kohle_nicht_erhalten = calculateHour (selectedFeedinTariff, kwh_ladung, usageHourEntry.utcHour, marketPrice);
                kohle_eur = kohle_eur - kohle_nicht_erhalten
                // print("Time: %s, Akku geladen mit %f kWh, Soc: %f, Geld verloren: %f ct" % (point_verbrauch['time'], kwh_einspeisung_netto, soc, kohle_nicht_erhalten))            }
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
                let kohle_gespart = calculateHour (selectedUsageTariff, kwh_gespart, usageHourEntry.utcHour, marketPrice);
                // We need 1 our and not 1 day
                kohle_gespart += calculateNetfee (selectedNetfees, 0, kwh_gespart);
                kohle_gespart += addVat (kohle_gespart);
                kohle_eur = kohle_eur + kohle_gespart;
                // print("Time: %s, Akku entladen mit %f kWh, Soc: %f, Geld gespart: %f ct" % (point_verbrauch['time'], kwh_gespart, soc, kohle_gespart))
            }

            lineData.push({
                date: format(date, "yyyy-MM-dd HH:mm"),
                usedKwh: kwh_verbrauch,
                feedinKwh: kwh_einspeisung,
                chargedKwh: kwh_ladung,
                dischargedKwh: kwh_gespart,
                socKwh: soc,
                socPercent: soc / selectedStorageSize,
                eurSaved: kohle_eur
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