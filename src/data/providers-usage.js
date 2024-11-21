export const PROVIDERS_USAGE = [
    {
        name: "Netz NÖ",
        description: "Netz NÖ Verbrauch 2",
        // "Messzeitpunkt;Verbrauch (kWh);Qualität;"
        match: (fileContent) => {fileContent.startsWith("Messzeitpunkt;Verbrauch (kWh)")},
        // Input:
        // {
        //   Messzeitpunkt: "01.01.2024 00:15",
        //   Qualität: "G",
        //   Verbrauch (kWh): "0,079000"
        // }
        // Output:
        // { 
        //   hour: "2024-11-19T02:00", 
        //   value: 3.5 
        // }
        transform: (lineObject) => ({ 
            hour: lineObject['Messzeitpunkt'].parseDate("DD.MM.YYYY HH:MM"),
            value: lineObject['Vebrauch (kWh)'].replace(",", ".").parseFloat()
        }),

        descriptorUsage: "Verbrauch (kWh)",
        descriptorTimestamp: "Messzeitpunkt",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Qualität"],
        shouldSkip: null,
        fixupTimestamp: true,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Netz NÖ",
        description: "Netz NÖ Verbrauch 3 EEG",
        descriptorUsage: "Restnetzbezug (kWh)",
        descriptorTimestamp: "Messzeitpunkt",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Eigendeckung (kWh)", "Verbrauch (kWh)", ],
        shouldSkip: null,
        fixupTimestamp: true,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Netz NÖ",
        description: "Netz NÖ Verbrauch",
        descriptorUsage: "Gemessener Verbrauch (kWh)",
        descriptorTimestamp: "Messzeitpunkt",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Ersatzwert"],
        shouldSkip: null,
        fixupTimestamp: true,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Netz NÖ",
        description: "Netz NÖ Verbrauch 3",
        descriptorUsage: "Verbrauch (kWh)",
        descriptorTimestamp: "Messzeitpunkt",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: [],
        shouldSkip: null,
        fixupTimestamp: true,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Netz OÖ",
        description: "Netz OÖ",
        descriptorUsage: "kWh",
        descriptorTimestamp: "Datum",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["kW", "Status"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Netz Burgenland",
        description: "Netz Burgenland",
        descriptorUsage: "Verbrauch (kWh) - Gesamtverbrauch",
        descriptorTimestamp: "Start",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Ende"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Netz Burgenland",
        description: "Netz Burgenland V2",
        descriptorUsage: "Verbrauch (in kWh)",
        descriptorTimestamp: "Startdatum",
        descriptorTimeSub: "Startuhrzeit",
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: [/*" Status", */"Enddatum", "Enduhrzeit"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Kärten Netz",
        description: "Kärten Netz",
        descriptorUsage: "kWh",
        descriptorTimestamp: "Datum",
        descriptorTimeSub: "Zeit",
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Status"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Ebner Strom",
        description: "Ebner Strom",
        descriptorUsage: "Wert (kWh)",
        descriptorTimestamp: "Zeitstempel String",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage),
        otherFields: ["Angezeigter Zeitraum"],
        shouldSkip: (row) => {
            var valueObiscode = row["Obiscode"];
            return valueObiscode !== "1.8.0";
        },
        fixupTimestamp: true,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Wiener Netze",
        description: "Wiener Netze",
        descriptorUsage: "!Verbrauch [kWh]",
        descriptorTimestamp: "Datum",
        descriptorTimeSub: "Zeit von",
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Zeit bis"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Wiener Netze",
        description: "Wiener Netze E-Control",
        descriptorUsage: "!Verbrauch [kWh]",
        descriptorTimestamp: "Ende Ablesezeitraum",
        descriptorTimeSub: null,
        dateFormatString: "parseISO",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Messintervall"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Salzburg Netz",
        description: "Salzburg Netz",
        descriptorUsage: "!kWh",
        descriptorTimestamp: "Datum und Uhrzeit",
        descriptorTimeSub: null,
        dateFormatString: "yyyy-MM-dd HH:mm:ss",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Status"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Salzburg Netz",
        description: "Salzburg Netz V4",
        descriptorUsage: "!Restverbrauch",
        descriptorTimestamp: "Datum",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm:ss",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Status"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        // v1: "Energiemenge in kWh"
        // v2: "Verbrauch in kWh"
        // otherwise the same.
        name: "Linz AG",
        description: "Linz AG",
        descriptorUsage: "!in kWh",
        descriptorTimestamp: "Datum von",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm:ss",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Ersatzwert"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Stromnetz Graz",
        description: "Stromnetz Graz",
        descriptorUsage: "Verbrauch Einheitstarif",
        descriptorTimestamp: "Ablesezeitpunkt",
        descriptorTimeSub: null,
        dateFormatString: "parseISO",
        usageParse: (usage) => parseFloat(usage),
        otherFields: ["Zaehlerstand Einheitstarif", "Zaehlerstand Hochtarif", "Zaehlerstand Niedertarif", "Verbrauch Hochtarif", "Verbrauch Niedertarif"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Stromnetz Graz",
        description: "Stromnetz Graz V2",
        descriptorUsage: "Verbrauch Gesamt - 1.8.0",
        descriptorTimestamp: "Ablesezeitpunkt",
        descriptorTimeSub: null,
        dateFormatString: "parseISO",
        usageParse: (usage) => parseFloat(usage),
        otherFields: ["Zaehlerstand Gesamt - 1.8.0", "Zaehlerstand Hochtarif - 1.8.1", "Zaehlerstand Niedertarif - 1.8.2", "Verbrauch Hochtarif - 1.8.1", "Verbrauch Niedertarif - 1.8.2"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Energienetze Steiermark",
        description: "Energienetze Steiermark",
        descriptorUsage: "Verbrauch",
        descriptorTimestamp: "Verbrauchszeitraum Beginn",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Anlagennummer","Tarif","Verbrauchszeitraum Ende","Einheit","Messwert: VAL...gemessen, EST...rechnerisch ermittelt"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Energienetze Steiermark",
        description: "Energienetze Steiermark Leistung",
        descriptorUsage: "Wert",
        descriptorTimestamp: "Statistikzeitraum Beginn",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Anlagennummer","Tarif","Statistikzeitraum Ende","Einheit","Messwert: VAL...gemessen, EST...rechnerisch ermittelt"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Energienetze Steiermark",
        description: "Energienetze Steiermark V3",
        descriptorUsage: "Leistung",
        descriptorTimestamp: "Leistungszeitraum Beginn",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Anlagennummer","Tarif","Leistungszeitraum Ende","Einheit","Messwert: VAL...gemessen, EST...rechnerisch ermittelt"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Vorarlberg Netz",
        description: "Vorarlberg Netz",
        descriptorUsage: "Messwert in kWh",
        descriptorTimestamp: "Beginn der Messreihe",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Ende der Messreihe"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "TINETZ",
        description: "TINETZ",
        descriptorUsage: "VALUE2",
        descriptorTimestamp: "DATE_FROM2",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["DATE_FROM", "DATE_TO"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Stadtwerke Klagenfurt",
        description: "Stadtwerke Klagenfurt",
        descriptorUsage: "Verbrauch",
        descriptorTimestamp: "DatumUhrzeit",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Typ", "Anlage", "OBIS-Code", "Einheit"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "Stadtwerke Kufstein",
        description: "Stadtwerke Kufstein",
        descriptorUsage: "!AT005140h",
        descriptorTimestamp: "Datum",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage),
        otherFields: [],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        // date column contains a range, which is not parseable; drop end-date after dash
        preprocessDateString: (dateStr) => dateStr.split("-")[0]
    },
    {
        name: "IKB",
        description: "IKB",
        descriptorUsage: "!AT005100",
        descriptorTimestamp: "Datum",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage),
        otherFields: [],
        shouldSkip: null,
        fixupTimestamp: true,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "ClamStrom",
        description: "ClamStrom",
        descriptorUsage: "Vorschub (kWh) - Verbrauch",
        descriptorTimestamp: "Start",
        descriptorTimeSub: null,
        dateFormatString: "dd.MM.yyyy HH:mm",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Ende", "Zählerstand (kWh) - Verbrauch"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: null,
        preprocessDateString: (date) => date
    },
    {
        name: "eww Wels",
        description: "Energieversorger Wels",
        descriptorUsage: "!Netztarif",
        descriptorTimestamp: "BeginDate",
        descriptorTimeSub: null,
        dateFormatString: "yyyy-MM-dd HH:mm:ss",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Status", "EndDate", "Unit"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: "EndDate",
        preprocessDateString: (date) => date
    },
    {
        name: "eww Wels",
        description: "Energieversorger Wels V2",
        descriptorUsage: "!Restnetzbezug",
        descriptorTimestamp: "BeginDate",
        descriptorTimeSub: null,
        dateFormatString: "yyyy-MM-dd HH:mm:ss",
        usageParse: (usage) => parseFloat(usage.replace(",", ".")),
        otherFields: ["Status", "EndDate", "Unit"],
        shouldSkip: null,
        fixupTimestamp: false,
        feedin: false,
        endDescriptorTimestamp: "EndDate",
        preprocessDateString: (date) => date
    },
]
