import { test } from 'vitest'
import sausageData from './sausages.json'

test('Sausage entries should have unique IDs', () => {
  let previousId = 0;
  sausageData.forEach(entry => {
    if (entry.id <= previousId) {
      throw new Error(`Entry with id ${entry.id} does not have a unique, increasing id`);
    }
    previousId = entry.id;
  });
});

test('Sausage entries should have all properties set', () => {
  sausageData.forEach(entry => {
    if (
      entry.id === undefined ||
      entry.type === undefined ||
      entry.rating === undefined ||
      entry.dibl === undefined ||
      entry.dibu === undefined ||
      entry.song === undefined ||
      entry.episode === undefined ||
      entry.episodeID === undefined ||
      entry.episodeType === undefined ||
      entry.episodeLength === undefined
    ) {
      throw new Error(`Entry with id ${entry.id} does not have all properties set`);
    }
  });
});