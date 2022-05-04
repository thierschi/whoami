import { Save } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    LinearProgress,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { nameAtom } from '../../../atoms/name.atom';
import { useGame } from '../../../hook/game.hook';
import { useRefreshGame } from '../../../hook/refresh-game.hook';
import { disableScroll } from '../../../util/scroll.util';

export const SetWordScreen: React.FunctionComponent = (): JSX.Element => {
    React.useEffect(() => {
        disableScroll();
    }, []);

    const game = useGame();
    const name = useRecoilValue(nameAtom);
    useRefreshGame();

    React.useEffect(() => {
        if (_.isNull(game) || _.isNull(name)) return;

        if (
            game.host &&
            game.players.filter((p) => !_.isNull(p.word)).length ===
                game.players.length
        ) {
            const [playerName, playerGuid] = name.split('(guid)');

            const url = `${window.location.origin}/api/lockGame?code=${game.key}&playerName=${playerName}&playerGuid=${playerGuid}`;

            fetch(url, { method: 'POST' }).then((res) => {
                if (!res.ok) {
                    alert('Something went wrong');
                }
            });
        }
    }, [game, name]);

    const [inputWord, setInputWord] = React.useState('');
    const [inputHint, setInputHint] = React.useState('');
    const [inputURL, setInputURL] = React.useState('');

    const [inputWordIsValid, setInputWordIsValid] = React.useState(true);
    const [inputHintIsValid, setInputHintIsValid] = React.useState(true);
    const [inputURLIsValid, setInputURLIsValid] = React.useState(true);

    const delim = '(delim)';

    const partner = React.useMemo(() => {
        if (_.isNull(game) || _.isNull(name)) return null;

        const partnerName = game.players.filter((p) => p.name === name)[0]
            .partner;

        return game.players.filter((p) => p.name === partnerName)[0];
    }, [game, name]);

    const onWordInputChage = React.useCallback((e: any) => {
        if (e.target.value.length === 0 || e.target.value.indexOf(delim) > -1) {
            setInputWordIsValid(false);
            setInputWord(e.target.value);
            return;
        }

        setInputWordIsValid(true);
        setInputWord(e.target.value);
    }, []);

    const onHintInputChage = React.useCallback((e: any) => {
        if (e.target.value.indexOf(delim) > -1) {
            setInputHintIsValid(false);
            setInputHint(e.target.value);
            return;
        }

        setInputHintIsValid(true);
        setInputHint(e.target.value);
    }, []);

    const onURLInputChage = React.useCallback((e: any) => {
        if (e.target.value.indexOf(delim) > -1) {
            setInputURLIsValid(false);
            setInputURL(e.target.value);
            return;
        }

        setInputURLIsValid(true);
        setInputURL(e.target.value);
    }, []);

    const onSaveButtonClick = React.useCallback(async () => {
        if (!inputWordIsValid || !inputHintIsValid || !inputURLIsValid) {
            return;
        }

        if (inputWord.length === 0) {
            setInputWordIsValid(false);
            return;
        }

        if (_.isNull(name) || _.isNull(game)) return;

        const word = `${inputWord}${delim}${inputHint}${delim}${inputURL}`;
        const [playerName, playerGuid] = name.split('(guid)');

        const url = `${window.location.origin}/api/setWord?code=${game.key}&playerName=${playerName}&playerGuid=${playerGuid}&word=${word}`;

        const rawRes = await fetch(url, { method: 'POST' });

        if (!rawRes.ok) {
            alert('Please try again');
        }
    }, [
        inputWord,
        inputHint,
        inputURL,
        inputWordIsValid,
        inputHintIsValid,
        inputURLIsValid,
        game,
        name,
    ]);

    return _.isNull(game) || _.isNull(name) || _.isNull(partner) ? (
        <h1>Shit</h1>
    ) : (
        <Box height="100%" display="flex" flexDirection="column">
            <Box flex={0} textAlign="center">
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{ height: '100%' }}
                >
                    {!_.isNull(partner.word) ? (
                        <LinearProgress sx={{ width: '100%' }} />
                    ) : (
                        <Divider />
                    )}
                    <Typography variant="subtitle2">{game.key}</Typography>
                    <Typography variant="body2">
                        {`${
                            game.players.filter((p) => !_.isNull(p.word)).length
                        }/${
                            game.players.length
                        } Spieler haben bereits ein Wort.${
                            _.isNull(partner.word)
                                ? ''
                                : ' Warten auf die restlichen Spieler...'
                        }`}
                    </Typography>
                </Stack>
            </Box>
            <Box flex={1}>
                <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: '100%' }}
                >
                    <Card sx={{ width: '80%' }}>
                        <CardHeader
                            title={partner.name}
                            subheader="Gib deinem Partner ein Wort"
                        />

                        <CardContent>
                            <Stack spacing={1} alignItems="center">
                                <TextField
                                    label="Wort"
                                    required
                                    variant="filled"
                                    sx={{ width: '100%' }}
                                    onChange={onWordInputChage}
                                    error={!inputWordIsValid}
                                    defaultValue={
                                        _.isNull(partner.word)
                                            ? null
                                            : partner.word.split(delim)[0]
                                    }
                                    disabled={!_.isNull(partner.word)}
                                />
                                <TextField
                                    label="Erklärung"
                                    variant="filled"
                                    multiline
                                    rows={4}
                                    sx={{ width: '100%' }}
                                    onChange={onHintInputChage}
                                    error={!inputHintIsValid}
                                    defaultValue={
                                        _.isNull(partner.word)
                                            ? null
                                            : partner.word.split(delim)[1]
                                    }
                                    disabled={!_.isNull(partner.word)}
                                />
                                <TextField
                                    label="Link"
                                    variant="filled"
                                    sx={{ width: '100%' }}
                                    onChange={onURLInputChage}
                                    error={!inputURLIsValid}
                                    defaultValue={
                                        _.isNull(partner.word)
                                            ? null
                                            : partner.word.split(delim)[2]
                                    }
                                    disabled={!_.isNull(partner.word)}
                                />
                            </Stack>
                        </CardContent>
                        <CardActions>
                            <Box textAlign="center" sx={{ width: '100%' }}>
                                <Button
                                    startIcon={<Save />}
                                    size="small"
                                    onClick={onSaveButtonClick}
                                    disabled={!_.isNull(partner.word)}
                                >
                                    Speichern
                                </Button>
                            </Box>
                        </CardActions>
                    </Card>
                </Stack>
            </Box>
        </Box>
    );
};
