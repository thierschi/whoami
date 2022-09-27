import _ from 'lodash';
import { IGame } from './types';

const _games: Map<string, IGame> = new Map();
const _listeners: Map<string, ((g: IGame) => unknown)[]> = new Map();

const addGame = (g: IGame): void => {
  if (_games.has(g.key)) {
    throw new Error(`Game with key ${g.key} already exists`);
  }

  _games.set(g.key, g);
};

const getGame = (key: string): IGame | undefined => {
  const game = _games.get(key);

  //   if (_.isUndefined(game)) {
  //     throw new Error(`Game with key ${key} does not exist`);
  //   }

  return game;
};

const updateGame = (g: IGame): void => {
  if (!_games.has(g.key)) {
    throw new Error(`Game with key ${g.key} does not exist`);
  }

  _games.set(g.key, g);

  const listeners = _listeners.get(g.key);
  if (!_.isUndefined(listeners)) {
    for (const listener of listeners) {
      listener(g);
    }
  }
};

const addListener = (key: string, callback: (g: IGame) => unknown): void => {
  if (!_games.has(key)) {
    throw new Error(`Game with key ${key} does not exist`);
  }

  const currentListeners = _listeners.get(key);
  if (!_.isUndefined(currentListeners)) {
    currentListeners.push(callback);
    return;
  }
  _listeners.set(key, [callback]);
};

const removeListener = (key: string, callback: (g: IGame) => unknown): void => {
  if (!_games.has(key)) {
    throw new Error(`Game with key ${key} does not exist`);
  }

  const currentListeners = _listeners.get(key);
  if (!_.isUndefined(currentListeners)) {
    _listeners.set(
      key,
      currentListeners.filter((l) => l !== callback),
    );
    return;
  }
};

export const gameStroage = {
  add: addGame,
  get: getGame,
  update: updateGame,
  addListener: addListener,
  removeListener: removeListener,
};
