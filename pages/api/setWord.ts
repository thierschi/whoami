// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import { sanitizeGame, setWord } from '../../services/game.service';
import logger from '../../util/logging.util';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    const { code, playerName, playerGuid, word } = req.query;

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

    if (_.isUndefined(word) || !_.isString(word)) {
        res.status(400).json({
            error: 'No word or wrong type was provided!',
        });
        return;
    }

    const name = `${playerName}(guid)${playerGuid}`;
    const game = setWord(code, name, word);

    if (
        _.isNull(game) ||
        game.players.map((p) => p.name).indexOf(name) === -1
    ) {
        res.status(404).json({
            error: `No game with code ${code} was found!`,
        });
        return;
    }

    const partnerName = game.players.filter((p) => p.name === name)[0].partner;
    logger.info(
        `( ${game.key} ): ${name.split('(guid)')[0]} SET a word for ${
            partnerName?.split('(guid)')[0]
        }\n\t${name}\n\t${partnerName}`
    );
    res.status(200).json(sanitizeGame(game, name));
}
