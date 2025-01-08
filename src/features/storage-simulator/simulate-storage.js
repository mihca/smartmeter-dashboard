export function simulateStorage (usagePDR, feedinPDR, mdr, selectedStorageSize, selectedChargingLoss, selectedUsageTariff, selectedNetfees, selectedFeedinTariff) {
    const lineData = [];
    lineData.push({
        date: "2021-01-01",
        charged: 0,
        discharged: 0,
        soc: 0,
        moneySaved: 0
    });
    return lineData;
}
