// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createNewGame, sanitizeGame } from '../../services/game.service';
import logger from '../../util/logging.util';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    const { playerName, playerGuid } = req.query;

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
    const game = createNewGame(name);

    logger.info(
        `( ${game.key} ): Game was CREATED by ${
            name.split('(guid)')[0]
        }\n\t${name}`
    );
    res.status(200).json(sanitizeGame(game, name));
}
