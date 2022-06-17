import { Delete } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
} from '@mui/material';
import * as React from 'react';

interface IProps {
    guid: string;
}

export const DeleteNoteButton: React.FunctionComponent<IProps> = (
    props: IProps
): JSX.Element => {
    return (
        <>
            <IconButton sx={{ p: '10px' }}>
                <Delete />
            </IconButton>
            <Dialog
                open={open}
                onClose={void 0}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">
                    Möchtest du dich wirklich ausloggen?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={void 0} autoFocus>
                        Abbrechen
                    </Button>
                    <Button onClick={void 0}>Ausloggen</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
