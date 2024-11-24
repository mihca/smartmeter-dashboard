import Papa from "papaparse"

import { findProvider } from "./provider-selector";
import { format } from "date-fns";

export function importProviderFile (fileContentText, providers) {

    // Convert to string[]
    // const lines = fileContentText.split (/\r?\n/);

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
    const data = sumUpHourly (provider, csvObjectLines);

    return {
        provider: provider.name,
        dateFrom: format(data[0].hour, "dd.MM.yyyy"),
        dateTo: format(data[data.length-1].hour, "dd.MM.yyyy"),
        data: data 
        /*
        [
            {hour: "2024-11-19T01:00", value: 1.5},
            {hour: "2024-11-19T02:00", value: 3.5}
        ]
        */
    }
}

function sumUpHourly (provider, csvObjectLines) {
    let data = [];
    let hourSum = 0.0;
    csvObjectLines.forEach((lineObject) => {
        let dataset = provider.transform(lineObject);
        hourSum += dataset.value;
        if (dataset.timestamp.getMinutes() == 0) {
            data.push ({
                hour: dataset.timestamp,
                value: hourSum
            });
            hourSum = 0.0;
        }
    });
    return data;
}