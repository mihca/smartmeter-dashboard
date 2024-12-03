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
        name: 'smartTIMES',
        description: 'Monatlich angepasster Tarif mit Uhrzeiten',
        company: 'smartENERGY',
        link: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartCONTROL.pdf',
        base_fee_yearly_eur: 29.90,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            let price_ct = 13.3416;
            if ((hour >= 0 && hour < 6) || (hour >= 13 && hour < 15)) price_ct = 9.5333;
            if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 22)) price_ct = 10.9583;
            return kwh * price_ct;
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

