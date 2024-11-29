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
    const data = transformHourly (provider, csvObjectLines);

    return {
        provider: provider.name,
        dateFrom: format(data[0].utcHour, "dd.MM.yyyy"),
        dateTo: format(data[data.length-1].utcHour, "dd.MM.yyyy"),
        hourData: data 
        /* will be like:
        [
            {hour: "2024-11-19T01:00", value: 1.5},
            {hour: "2024-11-19T02:00", value: 3.5}
        ]
        */
    }
}

function transformHourly (provider, csvObjectLines) {
    
    let data = [];
    let hourSum = 0.0;
    let prevTimestamp = new Date();

    csvObjectLines.forEach((lineObject) => {
        
        let dataset = provider.transform(lineObject);
        hourSum += dataset.value;
        // console.log (dataset.timestamp, dataset.timestamp.getTime(), dataset.timestamp.getTime(), dataset.value);
        
        // We have a full hour
        if (dataset.timestamp.getMinutes() == 0) {
            
            let hourTimestamp = dataset.timestamp.getTime();
            if (hourTimestamp === prevTimestamp) {
                hourTimestamp += 1000*60*60;
                console.log("Found summertime backswitch: ", prevTimestamp, " shift to ", hourTimestamp);
            }
            
            console.log (hourTimestamp, new Date(hourTimestamp), hourSum);
            
            data.push ({
                utcHour: hourTimestamp,
                value: hourSum
            });
            
            hourSum = 0.0;
            prevTimestamp = hourTimestamp;
        }
    });
    return data;
}

function local2UTC(date) {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );
};