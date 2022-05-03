import { EmojiPeople } from '@mui/icons-material';
import {
    AppBar as MUIAppBar,
    Box,
    Icon,
    Toolbar,
    Typography,
} from '@mui/material';
import * as React from 'react';
import { UserMenu } from './components/user-menu.component';

export const AppBar: React.FunctionComponent = (): JSX.Element => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <MUIAppBar position="static">
                <Toolbar>
                    <Icon
                        // size="large"
                        // edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <EmojiPeople />
                    </Icon>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Whoami
                    </Typography>

                    <UserMenu />
                </Toolbar>
            </MUIAppBar>
        </Box>
    );
};
