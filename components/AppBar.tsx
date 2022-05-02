import { EmojiPeople, Logout } from '@mui/icons-material';
import {
    AppBar as MUIAppBar,
    Box,
    Button,
    Divider,
    Icon,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import * as React from 'react';

export const AppBar: React.FunctionComponent = (): JSX.Element => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                    <Button
                        color="inherit"
                        id="demo-positioned-button"
                        aria-controls={
                            open ? 'demo-positioned-menu' : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        Lukas
                    </Button>
                    <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem disabled>Lukas</MenuItem>
                        <Divider />
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                                <ListItemText>Ausloggen</ListItemText>
                            </ListItemIcon>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </MUIAppBar>
        </Box>
    );
};
