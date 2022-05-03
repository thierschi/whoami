import { atom } from 'recoil';
import { ISanitizedGame } from '../model/game/game.model';

export const gameAtom = atom<ISanitizedGame | null>({
    key: 'game-atom',
    default: null,
});
