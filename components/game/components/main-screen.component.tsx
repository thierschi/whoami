import { Button, Divider, Stack, TextField, Typography } from '@mui/material';
import _ from 'lodash';
import * as React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gameCodeAtom } from '../../../atoms/game-code.atom';
import { nameAtom } from '../../../atoms/name.atom';

export const MainScreen = (): JSX.Element => {
    const setGameCode = useSetRecoilState(gameCodeAtom);
    const name = useRecoilValue(nameAtom);

    const [inputHasError, setInputHasError] = React.useState(false);
    const [gameCodeInput, setGameCodeInput] = React.useState('');

    const onInputChange = React.useCallback(
        (e: any) => {
            if (e.target.value.length === 0) {
                setInputHasError(true);
                setGameCodeInput(e.target.value);
                return;
            }

            setInputHasError(false);
            setGameCodeInput(e.target.value);
        },
        [setInputHasError, setGameCodeInput]
    );

    const onJoinGameClick = React.useCallback(() => {
        if (gameCodeInput.length === 0) {
            setInputHasError(true);
            return;
        }

        setGameCode(gameCodeInput);
    }, [setInputHasError, setInputHasError, gameCodeInput]);

    const onCreateGameClick = React.useCallback(async () => {
        if (_.isNull(name)) return;

        const [playerName, playerGuid] = name.split('(guid)');

        const url = `${window.location.origin}/api/createGame?playerName=${playerName}&playerGuid=${playerGuid}`;

        const rawRes = await fetch(url, { method: 'POST' });
        const res = await rawRes.json();

        setGameCode(res.key);
    }, [name]);

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ height: '100%' }}
        >
            <Typography variant="h6">
                Hast du bereits einen Gamecode?
            </Typography>
            <TextField
                label="Gamecode"
                variant="outlined"
                onChange={onInputChange}
                error={inputHasError}
            />
            <Button variant="contained" onClick={onJoinGameClick}>
                Beitreten
            </Button>
            <Divider />
            <Divider style={{ width: '90%' }} />
            <Divider />
            <Typography variant="h6">Hast du noch keinen Gamecode?</Typography>
            <Button variant="contained" onClick={onCreateGameClick}>
                Erstellen
            </Button>
        </Stack>
    );
};
