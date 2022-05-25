import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';
import {
    blue,
    green,
    lightBlue,
    lightGreen,
    orange,
    pink,
    purple,
    red,
    yellow,
} from '@mui/material/colors';
import { Box } from '@mui/system';
import _ from 'lodash';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { nameAtom } from '../../../atoms/name.atom';
import { useGame } from '../../../hook/game.hook';
import { enableScroll } from '../../../util/scroll.util';
import { convertToValidURL } from '../../../util/url.util';

export const MainGameScreen: React.FunctionComponent = (): JSX.Element => {
    const game = useGame();

    const name = useRecoilValue(nameAtom);

    const players = React.useMemo(() => {
        if (_.isNull(game) || _.isNull(name)) return [];

        const np: typeof game.players = [];
        for (const player of game.players) {
            np.push({
                ...player,
                partner: game.players
                    .filter(
                        (p) => p.partner === player.name.split('(guid)')[0]
                    )[0]
                    .name.split('(guid)')[0],
            });
        }

        return np.filter((p) => p.name !== name);
    }, [game, name]);

    const me = React.useMemo(() => {
        if (_.isNull(game) || _.isNull(name)) return null;

        return {
            ...game.players.filter((p) => p.name === name)[0],
            partner: game.players
                .filter((p) => p.partner === name.split('(guid)')[0])[0]
                .name.split('(guid)')[0],
        };
    }, [game, name]);

    React.useEffect(() => {
        enableScroll();
    }, []);

    const colors = [
        red,
        green,
        blue,
        yellow,
        pink,
        lightBlue,
        lightGreen,
        orange,
        purple,
    ];

    return (
        <Box height="100%" display="flex" flexDirection="column">
            {!_.isNull(game) && (
                <Box flex={0}>
                    <Typography variant="subtitle2" textAlign="center">
                        {game.key}
                    </Typography>
                </Box>
            )}
            <Box flex={1} overflow="scroll">
                {!_.isNull(me) && (
                    <>
                        <Card
                            sx={{
                                width: '75%',
                                margin: 'auto',
                                marginTop: '15px',
                            }}
                            key={0}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{
                                            bgcolor:
                                                colors[0 % colors.length][500],
                                        }}
                                        aria-label="recipe"
                                    >
                                        {me.name.charAt(0)}
                                    </Avatar>
                                }
                                title={`${me.name.split('(guid)')[0]} (Du)`}
                                subheader={`von ${me.partner}`}
                            />
                        </Card>
                    </>
                )}
                {players.map((p, i) => (
                    <Card
                        sx={{
                            width: '75%',
                            margin: 'auto',
                            marginTop: '15px',
                        }}
                        key={0}
                    >
                        <CardHeader
                            avatar={
                                <Avatar
                                    sx={{
                                        bgcolor:
                                            colors[
                                                (i + 1) % colors.length
                                            ][500],
                                    }}
                                    aria-label="recipe"
                                >
                                    {p.name.charAt(0)}
                                </Avatar>
                            }
                            title={p.name}
                            subheader={`von ${p.partner}`}
                        />

                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                {_.isNull(p.word)
                                    ? ''
                                    : p.word.split('(delim)')[0]}
                            </Typography>
                            {(_.isNull(p.word)
                                ? ''
                                : p.word.split('(delim)')[1]) !== '' && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {_.isNull(p.word)
                                        ? ''
                                        : p.word.split('(delim)')[1]}
                                </Typography>
                            )}
                        </CardContent>
                        {(_.isNull(p.word)
                            ? ''
                            : p.word.split('(delim)')[2]) !== '' && (
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={() =>
                                        window.open(
                                            convertToValidURL(
                                                _.isNull(p.word)
                                                    ? ''
                                                    : p.word.split('(delim)')[2]
                                            ),
                                            '_blank'
                                        )
                                    }
                                >
                                    Mehr Info
                                </Button>
                            </CardActions>
                        )}
                    </Card>
                ))}
            </Box>
        </Box>
    );
};
