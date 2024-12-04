// ATTENTION: All prices are net prices without tax (ohne MwSt!)

export const TARIFFS = new Map([
    ['smartENERGY.smartBASIC', {
        name: 'smartBASIC',
        description: 'Fix Strompreis gültig ab 01/2024-12/2024 mit 18.1833 ct/kWh netto ohne Mwst',
        company: 'smartENERGY',
        link: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartBASIC.pdf',
        base_fee_yearly_eur: 29.90,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            return kwh * 18.1833;
        }
    }],
    ['smartENERGY.smartCONTROL', {
        name: 'smartCONTROL',
        description: 'Börsenstrompreis mit 1,2 ct netto Aufschlag',
        company: 'smartENERGY',
        link: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartCONTROL.pdf',
        base_fee_yearly_eur: 29.90,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            return kwh * ( market_price_ct + 1.2 );
        }
    }],
    ['smartENERGY.smartTIMES', {
        name: 'smartTIMES 2024',
        description: 'Monatlich angepasster Tarif mit Uhrzeiten',
        company: 'smartENERGY',
        link: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartCONTROL.pdf',
        base_fee_yearly_eur: 29.90,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            const matrix = new Map([
                // year.month: peak, shoulder, off-peak
                ["2024.1", [13.54, 11.12, 9.67]],
                ["2024.2", [11.66, 9.58, 8.33]],
                ["2024.3", [9.00, 7.39, 6.43]],
                ["2024.4", [8.30, 6.82, 5.93]],
                ["2024.5", [8.08, 6.64, 5.77]],
                ["2024.6", [9.60, 7.89, 6.86]],
                ["2024.7", [10.22, 8.40, 7.30]],
                ["2024.8", [9.93, 8.15, 7.09]],
                ["2024.9", [12.63, 10.37, 9.02]],
                ["2024.10", [11.97, 9.23, 8.55]],
                ["2024.11", [13.34, 10.96, 9.53]],
                ["2024.12", [15.30, 12.57, 10.93]]
            ]);
            let key = year + "." + (month+1);
            if (matrix.has(key)) {
                let priceArray = matrix.get(key);
                // console.log(key, ": [", priceArray[0], ",", priceArray[1], ",", priceArray[2], "]");
                let price_ct = priceArray[1];
                if ((hour > 0 && hour <= 6) || (hour > 13 && hour <= 15)) price_ct = priceArray[2];
                if ((hour > 7 && hour <= 10) || (hour > 17 && hour <= 22)) price_ct = priceArray[0];
                return kwh * price_ct;
            }
            return null;
        }
    }],
    ['web.investor', {
        name: 'Grünstrom Privat investor',
        description: 'Fix Strompreis gültig ab 01/2024-12/2024 mit 12.90 ct/kWh netto ohne Mwst',
        company: 'web',
        link: 'https://www.web.energy/fileadmin/media/documents/Gruenstrom/W.E.B_Gruenstrom_Produktblatt_investor_01.pdf',
        base_fee_yearly_eur: 42.00,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            return kwh * 12.90;
        }
    }],
]);

