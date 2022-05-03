import {
    Avatar,
    Button,
    Card,
    CardHeader,
    LinearProgress,
    Stack,
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
import { useRecoilState, useRecoilValue } from 'recoil';
import { nameAtom } from '../../../atoms/name.atom';
import { refreshGameAtom } from '../../../atoms/refresh-game.atom';
import { useRefreshGame } from '../../../hook/refresh-game.hook';
import { gameSelector } from '../../../selectors/game.selector';
import { enableScroll } from '../../../util/scroll.util';

export const NotStartedScreen = (): JSX.Element => {
    const game = useRecoilValue(gameSelector);
    const name = useRecoilValue(nameAtom);
    useRefreshGame();

    // const game = {
    //     key: 'test',
    //     host: true,
    //     players: [
    //         {
    //             name: 'Lukas',
    //             word: null,
    //             partner: null,
    //         },
    //         {
    //             name: 'Mxi',
    //             word: null,
    //             partner: null,
    //         },
    //         {
    //             name: 'Nico',
    //             word: null,
    //             partner: null,
    //         },
    //         {
    //             name: 'Mauritz',
    //             word: null,
    //             partner: null,
    //         },
    //         {
    //             name: 'Justin',
    //             word: null,
    //             partner: null,
    //         },
    //         {
    //             name: 'Anika',
    //             word: null,
    //             partner: null,
    //         },
    //     ],
    //     started: false,
    //     locked: false,
    // };

    const [refreshGame, setRefreshGame] = useRecoilState(refreshGameAtom);

    React.useEffect(() => {
        enableScroll();
    }, []);

    // React.useEffect(() => {
    //     setTimeout(() => {
    //         setRefreshGame(refreshGame + 1);
    //     }, 1000);
    // }, [refreshGame]);

    const onStartGameClick = React.useCallback(async () => {
        if (_.isNull(name) || _.isNull(game)) return;

        const [playerName, playerGuid] = name.split('(guid)');

        const url = `${window.location.origin}/api/startGame?code=${game.key}&playerName=${playerName}&playerGuid=${playerGuid}`;

        const rawRes = await fetch(url, { method: 'POST' });

        if (!rawRes.ok) {
            alert('Something went wrong');
        }
    }, [name]);

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

    return _.isNull(game) || _.isNull(name) ? (
        <h1>Shit</h1>
    ) : (
        <Box height="100%" display="flex" flexDirection="column">
            <Box flex={0}>
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{ height: '100%' }}
                >
                    <LinearProgress sx={{ width: '100%' }} />
                    <Typography variant="body1">
                        {`${game.players.length} Spieler sind beigetreten. Warten auf weitere...`}
                    </Typography>
                </Stack>
            </Box>
            <Box flex={1} overflow="scroll">
                {game.players.map((v, i) => (
                    <Card
                        sx={{ width: '75%', margin: 'auto', marginTop: '15px' }}
                        key={i}
                    >
                        <CardHeader
                            avatar={
                                <Avatar
                                    sx={{
                                        bgcolor:
                                            colors[
                                                Math.floor(
                                                    Math.random() *
                                                        colors.length
                                                )
                                            ][500],
                                    }}
                                    aria-label="recipe"
                                >
                                    {v.name.charAt(0)}
                                </Avatar>
                            }
                            title={
                                v.name === name
                                    ? v.name.split('(guid)')[0]
                                    : v.name
                            }
                            subheader={v.name === name ? 'Du' : null}
                        />
                    </Card>
                ))}
            </Box>
            {game.host && (
                <Box flex={0} textAlign="center" padding="15px">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={onStartGameClick}
                    >
                        Spiel starten
                    </Button>
                </Box>
            )}
        </Box>
    );
};
