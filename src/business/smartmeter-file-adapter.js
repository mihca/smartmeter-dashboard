import Papa from "papaparse"

import { findProvider } from "./provider-selector";

export function importProviderFile (fileContentText, providers) {

    // Convert to string[]
    const lines = fileContentText.split (/\r?\n/);

    // Find provider
    const provider = findProvider(providers, fileContentText);
    if (provider == null) {
        return {
            provider: "Unbekannt",
            dateFrom: "",
            dateTo: ""
        }
    }

    // Strip unnecessary data

    // Parse csv
    const csvObjectLines = Papa.parse(fileContentText, {header: true, skipEmptyLines: true}).data;

    // Sum up hourly
    let data = [];
    csvObjectLines.forEach((lineObject) => {
        data.push (provider.transform(lineObject));
    });

    console.log(data);

    return {
        provider: provider.name,
        dateFrom: "2024-01-01",
        dateTo: "2024-11-19",
        data: data 
        /*
        [
            {hour: "2024-11-19T01:00", value: 1.5},
            {hour: "2024-11-19T02:00", value: 3.5}
        ]
        */
    }
}