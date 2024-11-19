import Papa from "papaparse"

import { findProvider } from "./provider-selector";

export function importProviderFile (fileContentText, providers) {

    // Convert to string[]
    const lines = fileContentText.split (/\r?\n/);

    // Find provider
    const provider = findProvider(providers, lines[0]);

    // Strip unnecessary data

    // Parse csv
    const d = Papa.parse(fileContentText, {header: true});
    console.log(d.data);

    // Sum up hourly

    return {
        provider: "NetzNÖ",
        dateFrom: "2024-01-01",
        dateTo: "2024-11-19",
        data: [
            {hour: "2024-11-19T01:00", value: 1.5},
            {hour: "2024-11-19T02:00", value: 3.5}
        ]
    }
}