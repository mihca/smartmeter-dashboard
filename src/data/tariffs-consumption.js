// ATTENTION: 
// 1. All prices should be calculated as net prices without tax (ohne MwSt!)
// 2. "hour" passed as parameter to calculate is the begin of the hour, with the collected kwh from the end of the hour


export const TARIFFS_CONSUMPTION = new Map([
    ['awattar.neu', {
        name: 'aWATTar HOURLY',
        description: 'Börsenstrompreis mit 3% und 1,5 ct Aufschlag',
        company: 'aWATTar',
        link_url: 'https://www.awattar.at/tariffs/hourly',
        link_pdf: 'https://api.awattar.at/v1/templates/bba9e568-777c-43a7-b181-79de2188439f/content?accept-override=application/pdf',
        base_fee_yearly_eur: 57.48,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            return kwh * (market_price_ct + (Math.abs(market_price_ct) * 0.03) + 1.5);
        }
    }],
    ['smartENERGY.smartCONTROL', {
        name: 'smartCONTROL',
        description: 'Börsenstrompreis mit 1,2 ct netto Aufschlag',
        company: 'smartENERGY',
        link_url: 'https://www.smartenergy.at/smartcontrol',
        link_pdf: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartCONTROL.pdf',
        base_fee_monthly_eur: 2.49,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            return kwh * ( market_price_ct + 1.2 );
        }
    }],
    ['smartENERGY.smartTIMES', {
        name: 'smartTIMES',
        description: 'Monatlich angepasster Tarif mit 3 Preiszonen',
        company: 'smartENERGY',
        link_url: 'https://www.smartenergy.at/smarttimes',
        link_pdf: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartCONTROL.pdf',
        base_fee_monthly_eur: 2.49,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            const matrix = new Map([
                // year.month: peak, shoulder, off-peak
                ["2024.1", [9.67, 11.12, 13.54]],
                ["2024.2", [8.33, 9.58, 11.66]],
                ["2024.3", [6.43, 7.39, 9.00]],
                ["2024.4", [5.93, 6.82, 8.30]],
                ["2024.5", [5.77, 6.64, 8.08]],
                ["2024.6", [6.86, 7.89, 9.60]],
                ["2024.7", [7.30, 8.40, 10.22]],
                ["2024.8", [7.09, 8.15, 9.93]],
                ["2024.9", [9.02, 10.37, 12.63]],
                ["2024.10", [8.55, 9.23, 11.97]],
                ["2024.11", [9.53, 10.96, 13.34]],
                ["2024.12", [10.93, 12.57, 15.30]],
                ["2025.1", [12.33, 14.18, 17.26]],
                ["2025.2", [12.40, 14.26, 17.36]],
                ["2025.3", [10.83, 12.46, 15.17]]
            ]);
            let key = year + "." + (month+1);
            if (matrix.has(key)) {
                let priceArray = matrix.get(key);
                // console.log(key, ": [", priceArray[0], ",", priceArray[1], ",", priceArray[2], "]");
                let price_ct = priceArray[1]; // Default is shoulder, define other ranges:
                if (year >= 2025 && month>=2) {
                    // New zones from 2025.2
                    if ((hour >= 1 && hour < 5) || (hour >= 11 && hour < 15)) price_ct = priceArray[0]; // off-peak
                    if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 23)) price_ct = priceArray[2]; // peak
                } else {
                    if ((hour >= 0 && hour < 6) || (hour >= 13 && hour < 15)) price_ct = priceArray[0]; // off-peak
                    if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 22)) price_ct = priceArray[2]; // peak
                }
                return kwh * price_ct;
            }
            return NaN;
        }
    }],
    ['evn.smartaktiv', {
        name: 'Optima Smart Aktiv',
        description: 'Tarif mit monatlicher Preisanpassung',
        company: 'EVN',
        link_url: 'https://www.evn.at/home/strom/optimasmartaktivnatur',
        link_pdf: 'https://www.evn.at/getmedia/ac578f80-3dcf-4b4c-88fa-bb56b29a76c7/B914_Preisblatt_Strom_Optima_Smart_Aktiv.pdf',
        base_fee_monthly_eur: 5.00,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            const matrix = new Map([
                // year.month: day, freetime / gross prices!
                ["2024.1", [20.664, 15.144]],
                ["2024.2", [18.108, 14.448]],
                ["2024.3", [13.356, 11.844]],
                ["2024.4", [11.544, 11.484]],
                ["2024.5", [10.500, 11.556]],
                ["2024.6", [12.036, 13.032]],
                ["2024.7", [13.284, 14.004]],
                ["2024.8", [12.888, 13.236]],
                ["2024.9", [16.968, 15.648]],
                ["2024.10", [18.096, 14.160]],
                ["2024.11", [20.508, 14.532]],
                ["2024.12", [22.896, 16.608]],
                ["2025.1", [26.004, 18.180]],
            ]);
            let key = year + "." + (month+1);
            if (matrix.has(key)) {
                let priceArray = matrix.get(key);
                // console.log(key, ": [", priceArray[0], ",", priceArray[1], ",", priceArray[2], "]");
                let price_ct = priceArray[1]/1.2; // we need net prices
                if (hour > 8 && hour <= 20) price_ct = priceArray[0];
                return kwh * price_ct;
            }
            return NaN;
        }
    }],
    ['evn.smartgarant', {
        name: 'Optima Smart Garant',
        description: '12 Monate garantierter Tarif mit zwei Preiszonen von 08-20 Uhr und 20-08 Uhr',
        company: 'EVN',
        link_url: 'https://www.evn.at/home/strom/optimasmartgarant',
        link_pdf: 'https://www.evn.at/getmedia/ac578f80-3dcf-4b4c-88fa-bb56b29a76c7/B914_Preisblatt_Strom_Optima_Smart_Aktiv.pdf',
        base_fee_monthly_eur: 4.00,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            const matrix = new Map([
                // year.month: freetime, day / price is gross!
                ["2024", [17.6520, 21.8640]],
                ["2025", [17.9040, 22.5720]],
            ]);
            let key = "2024";
            if (matrix.has(key)) {
                let priceArray = matrix.get(key);
                let price_ct = priceArray[0]/1.2; // we need net prices
                if (hour > 8 && hour <= 20) price_ct = priceArray[1];
                return kwh * price_ct;
            }
            return null;
        }
    }],
    ['web.investor', {
        name: 'WEB Privat investor',
        description: 'Fix Strompreis gültig ab 01/2024 mit 12,90/15,48 ct/kWh',
        company: 'W.E.B',
        link_url: 'https://www.web.energy/at-de/privatkunde/gruenstrom-privat',
        link_pdf: 'https://www.web.energy/fileadmin/media/documents/Gruenstrom/W.E.B_Gruenstrom_Produktblatt_investor_01.pdf',
        base_fee_yearly_eur: 42.00,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            return kwh * 12.90;
        }
    }],
]);

