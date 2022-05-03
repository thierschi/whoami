import { Button, Stack, TextField, Typography, useTheme } from '@mui/material';
import _ from 'lodash';
import * as React from 'react';
import { useSetRecoilState } from 'recoil';
import { nameAtom } from '../../atoms/name.atom';
import { guid } from '../../util/guid.util';
import { saveNameToLS } from '../../util/local-storage.util';

export const NameScreen: React.FunctionComponent = (): JSX.Element => {
    const theme = useTheme();
    const setName = useSetRecoilState(nameAtom);

    const [nameString, setNameString] = React.useState<string>();
    const [inputIsValid, setInputIsValid] = React.useState(true);

    const onInputChange = React.useCallback(
        (e: any) => {
            if (
                e.target.value.length === 0 ||
                e.target.value.indexOf('(guid)') > -1
            ) {
                setInputIsValid(false);
                setNameString(e.target.value);
                return;
            }

            setInputIsValid(true);
            setNameString(e.target.value);
            return;
        },
        [setInputIsValid, setNameString]
    );

    const onSaveClick = React.useCallback(() => {
        if (_.isUndefined(nameString)) return;

        const name = `${nameString}(guid)${guid()}`;

        saveNameToLS(name);
        setName(name);
    }, [nameString, setName]);

    return (
        <Stack
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%' }}
        >
            <Typography variant="h5" gutterBottom>
                Gib dir einen Namen:
            </Typography>
            <TextField
                error={!inputIsValid}
                id="outlined-basic"
                label="Name"
                variant="outlined"
                onChange={onInputChange}
            />
            <Button
                variant="contained"
                onClick={onSaveClick}
                disabled={!inputIsValid || _.isUndefined(nameString)}
            >
                Weiter
            </Button>
        </Stack>
    );
};
