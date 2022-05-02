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

    if (_.isNull(game) || game.started) {
        res.status(404).json({
            error: `No game with code ${code} was found!`,
        });
        return;
    }

    while (true) {
        const players = [...game.players];
        let playerNames = players.map((e) => e.name);
        const newGame: IGame = { ...game, started: true, players: [] };

        for (const p of players) {
            const player = { ...p };

            const r = Math.floor(Math.random() * playerNames.length);
            player.partner = playerNames[r];
            playerNames = playerNames.filter((e) => e !== player.partner);

            newGame.players.push(player);
        }

        let allGood = true;

        for (const p of newGame.players) {
            if (p.name === p.partner) {
                allGood = false;
                break;
            }
        }

        if (!allGood) continue;

        res.status(200).json(newGame);
        return;
    }
}
