// Alle Netz-Gebühren in ct und ohne MwSt

export const NETFEES = [
    {
        name: 'NetzNÖ 2024',
        // Netznutzung Grundpreis pro Tag in ct: 9.863
        // Messpreis pro Tag in ct: 7.1671
        netfee_per_day_ct: 17.0301,
        // Netznutzung Arbeitspreis pro kWh in ct: 5.77
        // Netzverlustentgelt pro kWh in ct: 0.783
        // Elektrizitätsabgabe pro kWh in ct: 0.10
        netfee_per_kwh_ct: 6.653
    },
    {
        name: 'NetzNÖ 2025',
        netfee_per_day_ct: 26.8151,
        netfee_per_kwh_ct: 10.948
    }
];
