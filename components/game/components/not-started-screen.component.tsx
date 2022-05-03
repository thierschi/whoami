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
import { useRecoilValue } from 'recoil';
import { nameAtom } from '../../../atoms/name.atom';
import { useGame } from '../../../hook/game.hook';
import { useRefreshGame } from '../../../hook/refresh-game.hook';
import { enableScroll } from '../../../util/scroll.util';

export const NotStartedScreen = (): JSX.Element => {
    const game = useGame();
    useRefreshGame();

    const name = useRecoilValue(nameAtom);

    React.useEffect(() => {
        enableScroll();
    }, []);

    const onStartGameClick = React.useCallback(async () => {
        if (_.isNull(name) || _.isNull(game)) return;

        const [playerName, playerGuid] = name.split('(guid)');

        const url = `${window.location.origin}/api/startGame?code=${game.key}&playerName=${playerName}&playerGuid=${playerGuid}`;

        const rawRes = await fetch(url, { method: 'POST' });

        if (!rawRes.ok) {
            alert('Something went wrong');
        }
    }, [game, name]);

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
                    <Typography variant="h3">{game.key}</Typography>
                    <Typography variant="body1">
                        {`${game.players.length} Spieler ${
                            game.players.length === 1 ? 'ist' : 'sind'
                        } beigetreten. Warten auf weitere...`}
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
                                        bgcolor: colors[i % colors.length][500],
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
