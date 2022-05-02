// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
    getGame,
    IGame,
    lockGame,
    sanitizeGame,
    startGame,
} from '../../services/game.service';
import * as _ from 'lodash';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    const { code, playerName, playerGuid } = req.query;

    if (_.isUndefined(code) || !_.isString(code)) {
        res.status(400).json({ error: 'No code or wrong type was provided!' });
        return;
    }

    if (_.isUndefined(playerName) || !_.isString(playerName)) {
        res.status(400).json({
            error: 'No playerName or wrong type was provided!',
        });
        return;
    }

    if (_.isUndefined(playerGuid) || !_.isString(playerGuid)) {
        res.status(400).json({
            error: 'No playerGuid or wrong type was provided!',
        });
        return;
    }

    const name = `${playerName}(guid)${playerGuid}`;
    const game = lockGame(code, name);

    if (_.isNull(game)) {
        res.status(404).json({
            error: `No game with code ${code} was found!`,
        });
        return;
    }

    if (game.host !== name) {
        res.status(403).json({
            error: `${name} is not host of game ${code}.`,
        });
        return;
    }

    if (!game.locked) {
        res.status(409).json({
            error: 'Not all words were set.',
        });
    }

    res.status(200).json(sanitizeGame(game, name));
    return;
}
