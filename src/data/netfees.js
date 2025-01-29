// Alle Netz-Gebühren in ct und ohne MwSt

export const NETFEES = [
    {
        name: 'NetzNÖ 2024',
        // Netznutzung Grundpreis pro Tag in ct: 9.863
        // Messpreis pro Tag in ct: 7.1671
        netfee_per_day_ct: 17.0301,
        // Netznutzung Arbeitspreis pro kWh in ct: 5.77
        // Netzverlustentgelt pro kWh in ct: 0.783
        netfee_per_kwh_ct: 6.553,
        // Elektrizitätsabgabe pro kWh in ct: 0.10
        tax_per_kwh_ct: 0.10
    },
    {
        name: 'NetzNÖ 2025',
        // Netznutzung Grundpreis pro Tag in ct: 9.863
        // Messpreis pro Tag in ct: 7.1671
        netfee_per_day_ct: 17.0301,
        // Netznutzung Arbeitspreis pro kWh in ct: 10.02
        // Netzverlustentgelt pro kWh in ct: 0.783
        netfee_per_kwh_ct: 10.803,
        // Elektrizitätsabgabe pro kWh in ct: 0.10
        tax_per_kwh_ct: 0.10
    }
];
