import { Send } from '@mui/icons-material';
import { IconButton, InputBase, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gameCodeAtom } from '../../../atoms/game-code.atom';
import { notesAtom } from '../../../atoms/notes.atom';
import { INote } from '../../../model/local-storage/local-storage.mode';
import { invertArray } from '../../../util/array.util';
import { guid } from '../../../util/guid.util';
import {
    getNotesFromLS,
    removeNotesFromLS,
    saveNotesToLS,
} from '../../../util/local-storage.util';
import { enableScroll } from '../../../util/scroll.util';
import { DeleteNoteButton } from './note-delete-button.component';

export const Notes: React.FunctionComponent = (): JSX.Element => {
    React.useEffect(() => {
        enableScroll();
    }, []);

    const textInput = React.useRef<HTMLInputElement>(null);

    const [noteInput, setNoteInput] = React.useState('');
    const [notes, setNotes] = useRecoilState(notesAtom);
    const gameCode = useRecoilValue(gameCodeAtom);

    React.useEffect(() => {
        const localNotes = getNotesFromLS();

        if (_.isNull(localNotes) || localNotes.code !== gameCode) {
            removeNotesFromLS();
            return;
        }

        setNotes([...localNotes.notes]);
    }, [gameCode, setNotes]);

    const onSendClick = React.useCallback(() => {
        const newNotes = [...notes];
        let newNote: INote = {
            id: guid(),
            value: noteInput,
        };

        while (true) {
            let guidIsUsed = false;
            for (const note of notes) {
                if (note.id === newNote.id) {
                    guidIsUsed = true;
                    break;
                }
            }

            if (!guidIsUsed) {
                break;
            }

            newNote = {
                id: guid(),
                value: noteInput,
            };
        }

        newNotes.push(newNote);

        setNotes(newNotes);
        saveNotesToLS({ code: gameCode ?? '', notes: [...newNotes] });

        // @ts-ignore
        textInput.current.value = '';
    }, [notes, noteInput, setNotes, gameCode]);

    return (
        <Box height="100%" display="flex" flexDirection="column">
            <Box flex={1} overflow="scroll">
                {invertArray(notes).map((v, i) => (
                    <Paper
                        sx={{
                            width: '80%',
                            margin: 'auto',
                            marginTop: '15px',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            p: '5px 10px',
                        }}
                        key={i}
                        elevation={2}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                flex: 1,
                            }}
                        >
                            {v.value}
                        </Typography>
                        <DeleteNoteButton guid={v.id} />
                    </Paper>
                ))}
            </Box>
            <Box
                flex={0}
                sx={{
                    padding: '20px',
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Notiz verfassen"
                        onChange={(e: any) => setNoteInput(e.target.value)}
                        inputRef={textInput}
                        onKeyDown={(e: any) =>
                            e.code === 'Enter' ? onSendClick() : null
                        }
                    />
                    <IconButton
                        sx={{ p: '10px' }}
                        aria-label="search"
                        onClick={onSendClick}
                    >
                        <Send />
                    </IconButton>
                </Paper>
            </Box>
        </Box>
    );
};
