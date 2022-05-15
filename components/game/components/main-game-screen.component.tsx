import { Help, MoreVert } from '@mui/icons-material';
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from '@mui/material';
import {
    blue,
    green,
    lightBlue,
    lightGreen,
    orange,
    pink,
    purple,
    red,
    yellow,
} from '@mui/material/colors';
import { Box } from '@mui/system';
import _ from 'lodash';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { nameAtom } from '../../../atoms/name.atom';
import { useGame } from '../../../hook/game.hook';
import { enableScroll } from '../../../util/scroll.util';
import { convertToValidURL } from '../../../util/url.util';

export const MainGameScreen: React.FunctionComponent = (): JSX.Element => {
    const game = useGame();

    const name = useRecoilValue(nameAtom);

    const players = React.useMemo(() => {
        if (_.isNull(game) || _.isNull(name)) return [];

        return game.players.filter((p) => p.name !== name);
    }, [game, name]);

    const me = React.useMemo(() => {
        if (_.isNull(game) || _.isNull(name)) return null;

        return game.players.filter((p) => p.name === name)[0];
    }, [game, name]);

    React.useEffect(() => {
        enableScroll();
    }, []);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const colors = [
        red,
        green,
        blue,
        yellow,
        pink,
        lightBlue,
        lightGreen,
        orange,
        purple,
    ];

    return (
        <Box height="100%" display="flex" flexDirection="column">
            {!_.isNull(game) && (
                <Box flex={0}>
                    <Typography variant="subtitle2" textAlign="center">
                        {game.key}
                    </Typography>
                </Box>
            )}
            <Box flex={1} overflow="scroll">
                    {!_.isNull(me) && (
                        <>
                            <Card
                                sx={{
                                    width: '75%',
                                    margin: 'auto',
                                    marginTop: '15px',
                                }}
                                key={0}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            sx={{
                                                bgcolor:
                                                    colors[
                                                        0 % colors.length
                                                    ][500],
                                            }}
                                            aria-label="recipe"
                                        >
                                            {me.name.charAt(0)}
                                        </Avatar>
                                    }
                                    title={me.name.split('(guid)')[0]}
                                    subheader="Du"
                                    action={
                                        <IconButton
                                            id="me-settings-button"
                                            aria-controls={
                                                open
                                                    ? 'me-settings-menu'
                                                    : undefined
                                            }
                                            aria-haspopup="true"
                                            aria-expanded={
                                                open ? 'true' : undefined
                                            }
                                            onClick={handleClick}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    }
                                />
                            </Card>
                            <Menu
                                id="me-settings-menu"
                                aria-labelledby="me-settings-button"
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
                                <MenuItem
                                    onClick={() =>
                                        window.open(
                                            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                            '_blank'
                                        )
                                    }
                                >
                                    <ListItemIcon>
                                        <Help fontSize="small" />
                                        <ListItemText>Tipp</ListItemText>
                                    </ListItemIcon>
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                    {players.map((p, i) => (
                        <Card
                            sx={{
                                width: '75%',
                                margin: 'auto',
                                marginTop: '15px',
                            }}
                            key={0}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{
                                            bgcolor:
                                                colors[
                                                    (i + 1) % colors.length
                                                ][500],
                                        }}
                                        aria-label="recipe"
                                    >
                                        {p.name.charAt(0)}
                                    </Avatar>
                                }
                                title={p.name}
                            />

                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                >
                                    {_.isNull(p.word)
                                        ? ''
                                        : p.word.split('(delim)')[0]}
                                </Typography>
                                {(_.isNull(p.word)
                                    ? ''
                                    : p.word.split('(delim)')[1]) !== '' && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {_.isNull(p.word)
                                            ? ''
                                            : p.word.split('(delim)')[1]}
                                    </Typography>
                                )}
                            </CardContent>
                            {(_.isNull(p.word)
                                ? ''
                                : p.word.split('(delim)')[2]) !== '' && (
                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            window.open(
                                                convertToValidURL(
                                                    _.isNull(p.word)
                                                        ? ''
                                                        : p.word.split(
                                                              '(delim)'
                                                          )[2]
                                                ),
                                                '_blank'
                                            )
                                        }
                                    >
                                        Mehr Info
                                    </Button>
                                </CardActions>
                            )}
                        </Card>
                    ))}
            </Box>
        </Box>
    );
};
