import { Logout } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from '@mui/material';
import * as React from 'react';

interface IProps {
    onSignOutClick: () => any;
}

export const LogoutMenuItem: React.FunctionComponent<IProps> = (
    props: IProps
): JSX.Element => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <MenuItem onClick={handleClickOpen} color="red">
                <ListItemIcon sx={{ color: 'red' }}>
                    <Logout fontSize="small" />
                    <ListItemText>Ausloggen</ListItemText>
                </ListItemIcon>
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">
                    Möchtest du dich wirklich ausloggen?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={props.onSignOutClick}>Ausloggen</Button>
                    <Button onClick={handleClose} autoFocus>
                        Abbrechen
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
