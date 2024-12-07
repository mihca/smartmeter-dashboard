// Alle Netz-Gebühren in ct

export const NETFEES = [
    {
        name: 'NetzNÖ',
        // Netznutzung Grundpreis pro Tag in ct: 9.863
        // Messpreis pro Tag in ct: 7.1671
        netfee_per_day_ct: 17.0301,
        // Netznutzung Arbeitspreis pro kWh in ct: 5.77
        // Netzverlustentgelt pro kWh in ct: 0.783
        netfee_per_kwh_ct: 6.553,
        // Elektrizitätsabgabe pro kWh in ct: 0.10
        tax_per_kwh_ct: 0.10
    }
];

// Fixkosten
// Grundgebühr: 2,49
// 30 Tage Netz: 5,11
// Brutto: 9,12 EUR
// kwh + 1,2 + 6,553
// 10ct = 21ct brutto = 4,2 EUR/100 km
// 15ct = 27ct brutto = 5,4 EUR/100 km