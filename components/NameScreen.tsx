import { Button, Stack, TextField, Typography, useTheme } from '@mui/material';
import * as React from 'react';

export const NameScreen: React.FunctionComponent = (): JSX.Element => {
    const theme = useTheme();

    console.log(theme);
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
            <TextField id="outlined-basic" label="Name" variant="outlined" />
            <Button variant="contained">Weiter</Button>
        </Stack>
    );
};
