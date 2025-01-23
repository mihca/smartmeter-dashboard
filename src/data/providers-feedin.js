import {parse} from "date-fns"

export const PROVIDERS_FEEDIN = [
    {
        name: "Netz NÖ",
        description: "Netz NÖ Einspeiser 1",
        match: (fileContent) => fileContent.includes("Messzeitpunkt;Gemessene Menge (kWh)"),
        transform: (lineObject) => ({ 
            timestamp: parse (lineObject['Messzeitpunkt'], "dd.MM.yyyy HH:mm", new Date()),
            kwh: parseFloat(lineObject['Gemessene Menge (kWh)'].replace(",", "."))
        }),
    },
    {
        name: "Netz NÖ",
        description: "Netz NÖ Einspeiser 2",
        match: (fileContent) => fileContent.includes("Messzeitpunkt;Einspeisung (kWh)"),
        transform: (lineObject) => ({ 
            timestamp: parse (lineObject['Messzeitpunkt'], "dd.MM.yyyy HH:mm", new Date()),
            kwh: parseFloat(lineObject['Einspeisung (kWh)'].replace(",", "."))
        }),
    },
]
