// ATTENTION: All prices are net prices without tax (ohne MwSt!)

export const TARIFFS = [
    {
        name: 'smartBASIC',
        description: 'Fix Strompreis gültig ab 01/2024-12/2024 mit 18.1833 ct/kWh netto ohne Mwst',
        company: 'smartENERGY',
        link: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartBASIC.pdf',
        base_fee_yearly_eur: 29.90,
        rates_monthly: [
            {
                start: "2024-01",
                end: null,
                calculate: (hour, market_price_ct, kwh) => {
                    return kwh * 18.1833;
                }
            }
        ]
    },
    {
        name: 'smartCONTROL',
        description: 'Börsenstrompreis mit 1,2 ct netto Aufschlag',
        company: 'smartENERGY',
        link: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartCONTROL.pdf',
        base_fee_yearly_eur: 29.90,
        rates_monthly: [
            {
                start: "2023-10",
                end: null,
                calculate: (hour, market_price_ct, kwh) => {
                    return kwh * ( market_price_ct + 1.2 );
                }
            }
        ]
    },
    {
        name: 'smartTIMES',
        description: 'Monatlich angepasster Tarif mit Uhrzeiten',
        company: 'smartENERGY',
        link: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartCONTROL.pdf',
        base_fee_yearly_eur: 29.90,
        rates_monthly: [
            {
                start: "2024-11",
                end: "2024-11",
                calculate: (hour, market_price_ct, kwh) => {
                    let price_ct = 13.3416;
                    if ((hour >= 0 && hour < 6) || (hour >= 13 && hour < 15)) price_ct = 9.5333;
                    if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 22)) price_ct = 10.9583;
                    return kwh * price_ct;
                },
            }
        ]
    }
];

