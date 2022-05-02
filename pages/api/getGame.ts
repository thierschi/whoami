// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getGame, IGame } from '../../services/game.service';
import * as _ from 'lodash';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
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
    const game = getGame(code);

    console.log(code, name, game);

    if (
        _.isNull(game) ||
        game.players.map((p) => p.name).indexOf(name) === -1
    ) {
        res.status(404).json({
            error: `No game with code ${code} was found!`,
        });
        return;
    }

    const players = [...game.players];
    const player = players.filter((p) => p.name === name)[0];
    const cencoredPlayers = [
        ...players.filter((p) => p.name !== name),
        { ...player, word: null },
    ];

    res.status(200).json({ ...game, players: cencoredPlayers });
}
