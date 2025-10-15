export const TARIFFS_FEEDIN = new Map([
    ['awattar.sunny', {
        name: 'aWATTar SUNNY',
        description: 'Monatliche Anpassung auf Basis EEX Month Futures',
        company: 'aWATTar',
        link_url: 'https://www.awattar.at/tariffs/sunny',
        link_pdf: 'https://api.awattar.at/v1/templates/13dd4578-a73e-47ef-b6bf-6f724e330bfd/content?accept-override=application/pdf',
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
                ["2025.1", 12.182],
                ["2025.2", 11.016],
                ["2025.3", 9.473],
                ["2025.4", 4.967],
                ["2025.5", 2.755],
                ["2025.6", 2.422],
                ["2025.7", 2.0422],
                ["2025.8", 5.648],
                ["2025.9", 3.854],
                ["2025.10", 6.097],
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
        link_url: 'https://www.smartenergy.at/smartsunhourly',
        link_pdf: 'https://www.smartenergy.at/fileadmin/user_upload/downloads/Kundeninformation_und_Preisblatt_-_smartSUNHOURLY.pdf',
        base_fee_monthly_eur: 0,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            return kwh * ( market_price_ct - market_price_ct * 0.2 );
        }
    }],
    ['web.gruenstromlieferant', {
        name: 'W.E.B-Grünstrom Lieferant',
        description: 'Börsenstrompreis mit 20% Abschlag',
        company: 'smartENERGY',
        link_url: 'https://www.web.energy/at-de/privatkunde/web-gruenstrom-lieferant',
        link_pdf: 'https://www.web.energy/fileadmin/media/documents/Gruenstrom/W.E.B-Sonnenstrom_Lieferant_.pdf',
        base_fee_monthly_eur: 3.5,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            return kwh * 4.7;
        }
    }],
    ['oemag', {
        name: 'OeMAG',
        description: 'Monatlich angepasster Tarif',
        company: 'OeMAG',
        link_url: 'https://www.oem-ag.at/de/marktpreis/',
        base_fee_monthly_eur: 0,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            const matrix = new Map([
                // year.month: ct/kWh
                ["2023.1", 26.86],
                ["2023.2", 26.86],
                ["2023.3", 26.86],
                ["2023.4", 14.46],
                ["2023.5", 14.46],
                ["2023.6", 14.46],
                ["2023.7", 13.69],
                ["2023.8", 13.69],
                ["2023.9", 13.69],
                ["2023.10", 12.464],
                ["2023.11", 12.464],
                ["2023.12", 12.464],
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
                ["2024.12", 8.700],
                ["2025.1", 9.730],
                ["2025.2", 9.730],
                ["2025.3", 6.007],
                ["2025.4", 5.855],
                ["2025.5", 5.855],
                ["2025.6", 5.855],
                ["2025.7", 5.892],
                ["2025.8", 5.892],
                ["2025.9", 5.892],
                /* Estimated */
                ["2025.10", 5.892],
                ["2025.11", 5.892],
                ["2025.12", 5.892],
            ]);
            let key = year + "." + (month+1);
            if (matrix.has(key)) {
                let price_ct = matrix.get(key);
                return kwh * price_ct;
            }
            return NaN;
        }
    }],
    ['evn', {
        name: 'EVN Sonnenstrom',
        description: 'Monatlich angepasster Tarif',
        company: 'EVN',
        link_url: 'https://www.evn.at/home/sonnenstrom/abnahmevertrag-sonnenstrom',
        base_fee_monthly_eur: 0,
        calculate: (year, month, weekday, hour, market_price_ct, kwh) => {
            const matrix = new Map([
                // year.month: ct/kWh
                ["2024.1", 6.8],
                ["2024.2", 6.1],
                ["2024.3", 4.6],
                ["2024.4", 4.2],
                ["2024.5", 4.0],
                ["2024.6", 4.7],
                ["2024.7", 5.2],
                ["2024.8", 4.9],
                ["2024.9", 6.3],
                ["2024.10", 6.0],
                ["2024.11", 6.5],
                ["2024.12", 7.5],
                ["2025.1", 8.51],
                ["2025.2", 8.39],
                ["2025.3", 7.67],
                ["2025.4", 5.73],
                ["2025.5", 4.76],
                ["2025.6", 5.25],
                ["2025.7", 5.79],
                ["2025.8", 5.91],
                ["2025.9", 6.06],
                ["2025.10", 6.68],
            ]);
            let key = year + "." + (month+1);
            if (matrix.has(key)) {
                let price_ct = matrix.get(key);
                return kwh * price_ct;
            }
            return NaN;
        }
    }],
]);
