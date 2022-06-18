import { Delete } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
} from '@mui/material';
import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gameCodeAtom } from '../../../atoms/game-code.atom';
import { notesAtom } from '../../../atoms/notes.atom';
import { saveNotesToLS } from '../../../util/local-storage.util';

interface IProps {
    guid: string;
}

export const DeleteNoteButton: React.FunctionComponent<IProps> = (
    props: IProps
): JSX.Element => {
    const [open, setOpen] = React.useState(false);
    const [notes, setNotes] = useRecoilState(notesAtom);
    const gameCode = useRecoilValue(gameCodeAtom);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onDeleteClick = React.useCallback(() => {
        const newNotes = [...notes].filter((note) => note.id !== props.guid);

        setNotes(newNotes);
        saveNotesToLS({ code: gameCode ?? '', notes: [...newNotes] });

        handleClose();
    }, [notes, setNotes, gameCode, props.guid]);

    return (
        <>
            <IconButton sx={{ p: '10px' }} onClick={handleClickOpen}>
                <Delete />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">
                    Möchtest du die Nachricht wirklich löschen?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Abbrechen
                    </Button>
                    <Button onClick={onDeleteClick}>Löschen</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
