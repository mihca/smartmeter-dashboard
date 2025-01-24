import {parse} from "date-fns"

export const PROVIDERS_CONSUMPTION = [
    {
        name: "Netz NÖ",
        description: "Netz NÖ Verbrauch",
        match: (fileContent) => fileContent.includes("Messzeitpunkt;Gemessener Verbrauch (kWh)"),
        transform: (lineObject) => ({ 
            timestamp: parse (lineObject['Messzeitpunkt'], "dd.MM.yyyy HH:mm", new Date()),
            kwh: parseFloat(lineObject['Gemessener Verbrauch (kWh)'].replace(",", "."))
        }),
    },
    {
        name: "Netz NÖ",
        description: "Netz NÖ Verbrauch 2",
        match: (fileContent) => fileContent.includes("Messzeitpunkt;Verbrauch (kWh)"),
        transform: (lineObject) => ({ 
            timestamp: parse (lineObject['Messzeitpunkt'], "dd.MM.yyyy HH:mm", new Date()),
            kwh: parseFloat(lineObject['Verbrauch (kWh)'].replace(",", "."))
        }),
    },
]
