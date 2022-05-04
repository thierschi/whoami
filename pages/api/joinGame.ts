// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import { joinGame, sanitizeGame } from '../../services/game.service';
import logger from '../../util/logging.util';

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
        res.status(400).json({ error: 'No name or wrong type was provided!' });
        return;
    }

    if (_.isUndefined(playerGuid) || !_.isString(playerGuid)) {
        res.status(400).json({ error: 'No name or wrong type was provided!' });
        return;
    }

    try {
        const name = `${playerName}(guid)${playerGuid}`;
        const game = joinGame(code, name);

        if (_.isNull(game)) {
            res.status(404).json({
                error: `No game with code ${code} was found!`,
            });
            return;
        }

        logger.info(
            `( ${game.key} ): ${name.split('(guid)')[0]} JOINED as player ${
                game.players.length
            }\n\t${name}`
        );
        res.status(200).json(sanitizeGame(game, name));
    } catch (e) {
        res.status(409).json({
            error: `Conflicting playerName ${playerName}`,
        });
        return;
    }
}
