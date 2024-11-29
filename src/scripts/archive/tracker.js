import {addEntry} from './netzbetreiber.js';
import {processEntry} from './netzbetreiber.js';

export function buildTracker (provider, d) {
    var entries = [];

    while (i < d.length) {
        entries.push(addEntry(provider, d[i]));
        i++;
    }
    
    // postProcess();
    
    return entries;
}

function addEntry(provider, entry) {
    
    var res = processEntry(entry);
    if (res === null) {
        // skip
        return;
    }
    var hour = format(res.timestamp, "H");
    var fullday = format(res.timestamp, "yyyyMMdd")
    this.days.add(fullday);

    if (!(fullday in this.data)) {
        this.data[fullday] = {};
    }
    if (!(hour in this.data[fullday])) {
        this.data[fullday][hour] = new Decimal(0.0);
    }
    this.data[fullday][hour] = this.data[fullday][hour].plus(new Decimal(res.usage));
    return marketdata.addDay(fullday);
}

postProcess() {
    /* remove incomplete entries, e.g. if 15-interval is not activated some
     * Netzbetreiber put one entry for each day. This kind of data is not
     * useful for our purpose. */
    var entries = Object.entries(this.data);
    for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (Object.keys(e[1]).length < 2) {
            // console.log("e: ", e);
            // console.log("e[1]: ", e[1]);
            // console.log("e[1].length: ", Object.keys(e[1]).length);
            // console.log("removing this entry: ", e);
            // console.log("removing this entry via: ", e[0]);

            this.days.delete(e[0])
            delete this.data[e[0]];
        }
    }
}

