export const TARIFFS = new Map([
    ['awattar.sunny', {
        name: 'aWATTar SUNNY',
        description: 'Monatliche Anpassung auf Basis EEX Month Futures',
        company: 'aWATTar',
        link: 'https://api.awattar.at/v1/templates/13dd4578-a73e-47ef-b6bf-6f724e330bfd/content?accept-override=application/pdf',
        base_fee_yearly_eur: 57.48,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            const matrix = new Map([
                // year.month: ct/kWh
                ["2023.1", 34.477],
                ["2023.2", 17.410],
                ["2023.3", 13.219],
                ["2023.4", 10.642],
                ["2023.5", 10.004],
                ["2023.6", 8.533],
                ["2023.7", 8.291],
                ["2023.8", 8.328],
                ["2023.9", 8.405],
                ["2023.10", 8.570],
                ["2023.11", 10.316],
                ["2023.12", 9.361],
                ["2024.1", 7.774],
                ["2024.2", 7.246],
                ["2024.3", 5.385],
                ["2024.4", 4.677],
                ["2024.5", 2.921],
                ["2024.6", 3.583],
                ["2024.7", 5.429],
                ["2024.8", 4.273],
                ["2024.9", 5.692],
                ["2024.10", 6.288],
                ["2024.11", 7.099],
                ["2024.12", 9.205],
            ]);
            let key = year + "." + (month+1);
            if (matrix.has(key)) {
                let price_ct = matrix.get(key);
                return kwh * price_ct;
            }
            return null;
        }
    }],
    ['smartENERGY.smartSUNHOURLY', {
        name: 'smartSUNHOURLY',
        description: 'Börsenstrompreis mit 20% Abschlag',
        company: 'smartENERGY',
        link: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartSUNHOURLY.pdf',
        base_fee_monthly_eur: 0,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            return kwh * ( market_price_ct - market_price_ct * 0.2 );
        }
    }],
    ['oemag', {
        name: 'OeMAG',
        description: 'Monatlich angepasster Tarif mit Uhrzeiten',
        company: 'OeMAG',
        link: 'https://www.oem-ag.at/de/marktpreis/',
        base_fee_monthly_eur: 0,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            const matrix = new Map([
                // year.month: ct/kWh
                ["2024.1", 8.137],
                ["2024.2", 6.293],
                ["2024.3", 5.776],
                ["2024.4", 4.655],
                ["2024.5", 4.655],
                ["2024.6", 4.655],
                ["2024.7", 5.339],
                ["2024.8", 5.827],
                ["2024.9", 6.038],
                ["2024.10", 6.867],
                ["2024.11", 8.700],
            ]);
            let key = year + "." + (month+1);
            if (matrix.has(key)) {
                let price_ct = matrix.get(key);
                return kwh * price_ct;
            }
            return null;
        }
    }],
]);
