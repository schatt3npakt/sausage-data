import { test } from 'vitest'
import nseData from './nse.json'

test('NSE entries should have unique IDs', () => {
  let previousId = 0;
  nseData.forEach(entry => {
    if (entry.id <= previousId) {
      throw new Error(`Entry with id ${entry.id} does not have a unique, increasing id`);
    }
    previousId = entry.id;
  });
});

test('NSE entries should have all properties set', () => {
  nseData.forEach(entry => {
    if (
      entry.id === undefined ||
      entry.type === undefined ||
      entry.rating === undefined ||
      entry.song === undefined ||
      entry.episode === undefined ||
      entry.episodeID === undefined ||
      entry.episodeLength === undefined
    ) {
      throw new Error(`Entry with id ${entry.id} does not have all properties set`);
    }
  });
});