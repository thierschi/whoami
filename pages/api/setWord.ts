// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getGame, IGame } from '../../services/game.service';
import * as _ from 'lodash';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { code } = req.query;

    if (_.isUndefined(code) || !_.isString(code)) {
        res.status(400).json({ error: 'No code or wrong type was provided!' });
        return;
    }

    const game = getGame(code);

    if (_.isNull(game) || game.locked) {
        res.status(404).json({
            error: `No game with code ${code} was found!`,
        });
        return;
    }
}
