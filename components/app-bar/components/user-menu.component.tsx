import { Close, Logout, Person } from '@mui/icons-material';
import {
    Button,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';
import * as React from 'react';
import { useRecoilState } from 'recoil';
import { nameAtom } from '../../../atoms/name.atom';
import { removeNameFromLS } from '../../../util/local-storage.util';
import { removeCodeFromSs } from '../../../util/session-storage.util';

export const UserMenu: React.FunctionComponent = (): JSX.Element => {
    const [name, setName] = useRecoilState(nameAtom);

    const clearName = React.useMemo(() => name?.split('(guid)')[0], [name]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSignOutClick = React.useCallback(() => {
        removeNameFromLS();
        setName(null);
        window.location.reload();
        // TODO clear all else

        handleClose();
    }, [setName]);

    const onExitGame = React.useCallback(() => {
        removeCodeFromSs();
        window.location.reload();

        handleClose();
    }, []);

    return (
        <>
            <Button
                color="inherit"
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {clearName}
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
                <MenuItem disabled>
                    <ListItemIcon>
                        <Person fontSize="small" />
                        <ListItemText>{clearName}</ListItemText>
                    </ListItemIcon>
                </MenuItem>
                <Divider />
                <MenuItem onClick={onSignOutClick}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                        <ListItemText>Ausloggen</ListItemText>
                    </ListItemIcon>
                </MenuItem>

                <MenuItem onClick={onExitGame}>
                    <ListItemIcon>
                        <Close fontSize="small" />
                        <ListItemText>Spiel verlassen</ListItemText>
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </>
    );
};
