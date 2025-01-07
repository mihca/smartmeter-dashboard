import Papa from "papaparse"

import { findProvider } from "./provider-selector";

export function importProviderFile (fileContentText, providers) {

    // Convert to string[]
    // const lines = fileContentText.split (/\r?\n/);

    // Find provider
    const provider = findProvider(providers, fileContentText);
    if (provider == null) {
        return {
            provider: "Unbekannt"
        }
    }

    // Strip unnecessary data

    // Parse csv
    const csvObjectLines = Papa.parse(fileContentText, {header: true, skipEmptyLines: true}).data;

    // Sum up hourly
    const {sumKwh, data} = transformHourly (provider, csvObjectLines);

    return {
        provider: provider.name,
        kwh: sumKwh,
        utcHourFrom: data[0].utcHour,
        utcHourTo: data[data.length-1].utcHour,
        hourData: data 
        /* will be like:
        [
            {utcHour: 1732658400000, kwh: 1.5},
            {utcHour: 1732662000000, kwh: 3.5}
        ]
        */
    }
}

function transformHourly (provider, csvObjectLines) {
    
    let data = [];
    let hourSumKwh = 0.0;
    let prevTimestamp = new Date();
    let overallSumKwh = 0.0;

    csvObjectLines.forEach((lineObject) => {
        
        let dataset = provider.transform(lineObject);
        hourSumKwh += dataset.kwh;
        
        // We have a full hour
        if (dataset.timestamp.getMinutes() === 0) {
            
            let hourTimestamp = dataset.timestamp.getTime();
            if (hourTimestamp === prevTimestamp) {
                hourTimestamp += 3600000;
                console.log("Found summertime backswitch: ", prevTimestamp, " shift to ", hourTimestamp);
            }
            
            // console.log (hourTimestamp, new Date(hourTimestamp), hourSumKwh);
            
            data.push ({
                utcHour: hourTimestamp,
                kwh: hourSumKwh
            });
            
            overallSumKwh += hourSumKwh;
            hourSumKwh = 0.0;
            prevTimestamp = hourTimestamp;
        }
    });
    
    return {
        sumKwh: overallSumKwh,
        data: data
    }
}
