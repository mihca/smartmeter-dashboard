import {describe, expect, test} from '@jest/globals'
import {importProviderFile} from '../src/business/smartmeter-file-adapter'
import {PROVIDERS_USAGE} from '../src/data/providers-usage'
import fs from 'fs';
import path from 'path';

describe('NetzNÖ', () => {
  test('recognize NetzNÖ file', () => {
    let fileContent = fs.readFileSync(path.join(__dirname, '../src/samples/NetzNOE-2024-01-01.csv'), 'utf8');
    expect(importProviderFile(fileContent, PROVIDERS_USAGE)).toStrictEqual(
      {
        "provider": "NetzNÖ",
        "dateTo": "2024-01-01",
        "dateFrom": "2024-01-02",
        "data": [
          {"hour": "2024-01-01T00:00", "value": 1.5}, 
          {"hour": "2024-11-19T02:00", "value": 3.5}
        ]
      }
    );
  });
});
