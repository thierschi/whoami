import { Backdrop, Link, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';

export const ChangeLog: React.FunctionComponent = (): JSX.Element => {
    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '5px',
                    width: '100%',
                }}
                textAlign="center"
            >
                <Link onClick={() => alert('Hello')}>Changelog</Link>
            </Box>
            <Backdrop
                open={true}
                sx={{
                    zIndex: '100',
                }}
            >
                <Paper sx={{ width: '90%', height: '90%', padding: '10px' }}>
                    <Typography variant="h3">Changelog</Typography>
                    <Box overflow="scroll">
                        <Typography variant="subtitle2">v0.0.1</Typography>
                        <Typography variant="body1">Cock and Balls</Typography>
                    </Box>
                </Paper>
            </Backdrop>
        </>
    );
};
