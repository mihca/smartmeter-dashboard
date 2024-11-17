export const PROVIDERS_FEEDIN = [
    {
        name: "Netz NÖ",
        description: "Netz NÖ Einspeiser 1",
        descriptorUsage: "Gemessene Menge (kWh)",
        descriptorTimestamp: "Messzeitpunkt",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: null,
        shouldSkip: null,
        fixupTimestamp: true,
        feedin: true,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Netz NÖ",
        description: "Netz NÖ Einspeiser 2",
        descriptorUsage: "Einspeisung (kWh)",
        descriptorTimestamp: "Messzeitpunkt",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: null,
        shouldSkip: null,
        fixupTimestamp: true,
        feedin: true,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Wiener Netze",
        description: "Wiener Netze Einspeiser",
        descriptorUsage: "!Einspeiser [kWh]",
        descriptorTimestamp: "Datum",
        descriptorTimeSub: "Zeit von",
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Zeit bis"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: true,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    }
]
