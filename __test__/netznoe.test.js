import {describe, expect, test} from '@jest/globals'
import {importProviderFile} from '../src/features/import/smartmeter-file-adapter'
import {PROVIDERS_USAGE} from '../src/data/providers-usage'
import fs from 'fs';
import path from 'path';

describe('NetzNÖ', () => {
  test('import NetzNÖ file', () => {
    let fileContent = fs.readFileSync(path.join(__dirname, '../samples/NetzNOE-2024-01-01.csv'), 'utf8');
    expect(importProviderFile(fileContent, PROVIDERS_USAGE)).toStrictEqual(
      {
        "provider": "NetzNÖ",
        "kwh": 48.08,
        "dateFrom": "2024-01-01",
        "dateTo": "2024-01-03",
        "hourData": [
          {"hour": "2024-01-01T00:00", "value": 1.5}, 
        ]
      }
    );
  });
});
