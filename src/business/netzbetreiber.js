import { parse, parseISO } from "date-fns";

export function selectProvider(providers, sample) {
    for (var idx = 0; idx < providers.length; idx++) {
        var provider = providers[idx];
        if (probe(provider, sample)) {
            return provider;
        }
    }

    console.log("sample: ", sample);
    return null;
}

function processEntry(provider, entry) {
    
    if (!probe(provider, entry)) {
        return null;
    }
    if (provider.shouldSkip !== null && provider.shouldSkip(entry)) {
        return null;
    }

    var valueTimestamp = entry[provider.descriptorTimestamp];
    if (provider.descriptorTimeSub !== null) {
        valueTimestamp += " " + entry[provider.descriptorTimeSub];
    }

    valueTimestamp = provider.preprocessDateString(valueTimestamp);

    var parsedTimestamp = null;
    if (provider.dateFormatString === "parseISO") {
        parsedTimestamp = parseISO(valueTimestamp);
    } else {
        parsedTimestamp = parse(valueTimestamp, provider.dateFormatString, new Date())
    }

    var valueUsage = entry[matchUsage(entry)];
    if (valueUsage === "" || valueUsage === undefined) {
        return null;
    }
    var parsedUsage = provider.usageParser(valueUsage);

    if (provider.fixupTimestamp) {
        /* most Netzbetreiber specify the start date, for some it's ambigious and only obvious by looking at the first and last entry of a single day export, e.g.
            * > Messzeitpunkt;Gemessener Verbrauch (kWh);Ersatzwert;
            * > 10.11.2023 00:15;0,228000;;
            * > 10.11.2023 00:30;0,197000;;
            * > [...]
            * > 10.11.2023 23:45;0,214000;;
            * > 11.11.2023 00:00;0,397000;;
        */
        var MS_PER_MINUTE = 60000;
        parsedTimestamp = new Date(parsedTimestamp - 15 * MS_PER_MINUTE);
    }

    if (provider.endDescriptorTimestamp != null) {
        /* some Netzbetreiber mix the dataset with per-day consumption entries interleaved. Filter them */
        var endValueTimestamp = entry[provider.endDescriptorTimestamp];

        var endParsedTimestamp = null;
        if (provider.dateFormatString === "parseISO") {
            endParsedTimestamp = parseISO(endValueTimestamp);
        } else {
            endParsedTimestamp = parse(endValueTimestamp, provider.dateFormatString, new Date())
        }

        var MS_PER_MINUTE = 60000;
        if ((endParsedTimestamp - parsedTimestamp) > 15 * MS_PER_MINUTE) {
            /* not a 15min entry, ignore it */
            return null;
        }
    }

    return {
        timestamp: parsedTimestamp,
        usage: parsedUsage,
    }
}

function probe(provider, entry) {
    if (matchUsage(provider, entry) === null) {
        return false;
    }
    if (!(provider.descriptorTimestamp in entry)) {
        return false;
    }
    for (var e in provider.otherFields) {
        if (!(provider.otherFields[e] in entry)) {
            return false;
        }
    }
    if ('Datum' in entry && provider.preprocessDateString(entry.Datum) == null) {
        return false;
    }
    return true;
}

function matchUsage(provider, entry) {
    if (provider.descriptorUsage[0] === '!') {
        /* fuzzy check as we don't know the exact column name */
        var desc = provider.descriptorUsage.substring(1);
        var entries = Object.keys(entry);
        for (var e in entries) {
            if (entries[e].includes(desc)) {
                return entries[e];
            }
        }
    } else {
        if (provider.descriptorUsage in entry) {
            return provider.descriptorUsage;
        }
    }
    return null;
}

