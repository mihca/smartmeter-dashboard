import {describe, expect, test} from '@jest/globals'
import {importProviderFile} from '../src/features/import/smartmeter-file-adapter'
import {PROVIDERS_USAGE} from '../src/data/providers-usage'
import fs from 'fs';
import path from 'path';

describe('NetzNÖ', () => {
  test('import NetzNÖ file', () => {
    let fileContent = fs.readFileSync(path.join(__dirname, './samples/NetzNOE-2024-01-01.csv'), 'utf8');
    expect(importProviderFile(fileContent, PROVIDERS_USAGE)).toStrictEqual(
      {
        "provider": "Netz NÖ",
        "kwh": 36.319,
        "utcHourFrom": 1704067200000,
        "utcHourTo": 1704153600000,
        "hourData": [
          {"utcHour": 1704067200000, "kwh": 0.217}, 
          {"utcHour": 1704070800000, "kwh": 0.187}, 
          {"utcHour": 1704074400000, "kwh": 0.189}, 
          {"utcHour": 1704078000000, "kwh": 0.181}, 
          {"utcHour": 1704081600000, "kwh": 2.732}, 
          {"utcHour": 1704085200000, "kwh": 1.616}, 
          {"utcHour": 1704088800000, "kwh": 1.256}, 
          {"utcHour": 1704092400000, "kwh": 1.136}, 
          {"utcHour": 1704096000000, "kwh": 0.912}, 
          {"utcHour": 1704099600000, "kwh": 1.408}, 
          {"utcHour": 1704103200000, "kwh": 8.986}, 
          {"utcHour": 1704106800000, "kwh": 7.663}, 
          {"utcHour": 1704110400000, "kwh": 5.549}, 
          {"utcHour": 1704114000000, "kwh": 0.278}, 
          {"utcHour": 1704117600000, "kwh": 0.06}, 
          {"utcHour": 1704121200000, "kwh": 0.121}, 
          {"utcHour": 1704124800000, "kwh": 0.244}, 
          {"utcHour": 1704128400000, "kwh": 0.196}, 
          {"utcHour": 1704132000000, "kwh": 0.706}, 
          {"utcHour": 1704135600000, "kwh": 0.536},
          {"utcHour": 1704139200000, "kwh": 0.498},
          {"utcHour": 1704142800000, "kwh": 0.64},
          {"utcHour": 1704146400000, "kwh": 0.35},
          {"utcHour": 1704150000000, "kwh": 0.341},
          {"utcHour": 1704153600000, "kwh": 0.317}
        ]
      }
    );
  });
});
