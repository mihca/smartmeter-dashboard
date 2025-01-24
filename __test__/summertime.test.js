import {describe, expect, test} from '@jest/globals'
import {importProviderFile} from '../src/features/import/smartmeter-file-adapter'
import {PROVIDERS_CONSUMPTION} from '../src/data/providers-consumption'
import fs from 'fs';
import path from 'path';

describe('NetzNÖ', () => {
  test('import NetzNÖ file with summertime backswitch', () => {
    let fileContent = fs.readFileSync(path.join(__dirname, './samples/NetzNOE-2024-10-27.csv'), 'utf8');
    expect(importProviderFile(fileContent, PROVIDERS_CONSUMPTION)).toStrictEqual(
      {
        "provider": "Netz NÖ",
        "kwh": 27.754,
        "utcHourFrom": 1729980000000,
        "utcHourTo": 1730070000000,
        "hourData": [
          {"utcHour": 1729980000000, "kwh": 0.068}, 
          {"utcHour": 1729983600000, "kwh": 0.278}, 
          {"utcHour": 1729987200000, "kwh": 0.266}, 
          {"utcHour": 1729990800000, "kwh": 0.18}, 
          {"utcHour": 1729994400000, "kwh": 0.161}, 
          {"utcHour": 1729998000000, "kwh": 10.581}, 
          {"utcHour": 1730001600000, "kwh": 0.335}, 
          {"utcHour": 1730005200000, "kwh": 0.163},	
          {"utcHour": 1730008800000, "kwh": 0.16}, 
          {"utcHour": 1730012400000, "kwh": 0.751}, 
          {"utcHour": 1730016000000, "kwh": 0}, 
          {"utcHour": 1730019600000, "kwh": 0}, 
          {"utcHour": 1730023200000, "kwh": 0}, 
          {"utcHour": 1730026800000, "kwh": 0.042}, 
          {"utcHour": 1730030400000, "kwh": 0.011}, 
          {"utcHour": 1730034000000, "kwh": 2.695}, 
          {"utcHour": 1730037600000, "kwh": 0.008}, 
          {"utcHour": 1730041200000, "kwh": 0.007}, 
          {"utcHour": 1730044800000, "kwh": 0.053}, 
          {"utcHour": 1730048400000, "kwh": 0.201}, 
          {"utcHour": 1730052000000, "kwh": 10.167}, 
          {"utcHour": 1730055600000, "kwh": 0.517}, 
          {"utcHour": 1730059200000, "kwh": 0.35}, 
          {"utcHour": 1730062800000, "kwh": 0.325},
          {"utcHour": 1730066400000, "kwh": 0.275},
          {"utcHour": 1730070000000, "kwh": 0.16},
        ]
      }
    );
  });
});
