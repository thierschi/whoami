import { Check, ContentCopy } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import * as React from 'react';

interface IProps {
    content: string;
}

export const CopyButton: React.FunctionComponent<IProps> = (props: IProps) => {
    const [wasJustCopied, setWasJustCopied] = React.useState(false);

    const onCopy = React.useCallback(() => {
        setWasJustCopied(true);

        setTimeout(() => {
            setWasJustCopied(false);
        }, 3000);
    }, []);

    return (
        <IconButton disabled={wasJustCopied}>
            {wasJustCopied ? <Check /> : <ContentCopy />}
        </IconButton>
    );
};
