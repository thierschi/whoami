import { GitHub, InfoOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import _ from 'lodash';
import { BuiltInProviderType } from 'next-auth/providers';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useGuestSignIn, useMe } from '../../auth/users/hooks';

type NextAuthProviders = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

// Map provider name to icon
const icons: Record<string, JSX.Element> = {
  GitHub: <GitHub />,
};

const SignInPage: React.FunctionComponent = (): JSX.Element => {
  const me = useMe();
  const router = useRouter();

  React.useEffect(() => {
    // Redirect if user is already signed in
    if (!_.isNull(me)) {
      router.replace('/game');
    }
  }, [me]);

  const [providers, setProviders] = React.useState<NextAuthProviders | null>(
    null,
  );
  const [showGuestTF, setShowGuestTF] = React.useState(false);
  const [guestName, setGuestName] = React.useState('');
  const [guestInputHasError, setGuestInputHasError] = React.useState(false);

  ///////// Callbacks /////////

  const signInAsGuest = useGuestSignIn();
  const onGuestNameChange = React.useCallback((e: any) => {
    if (e.target.value.length === 0) {
      return setGuestInputHasError(true);
    }

    setGuestInputHasError(false);
    setGuestName(e.target.value);
    console.log(e.target.value);
  }, []);
  const onGuestSignInClick = React.useCallback(() => {
    if (guestName.length === 0) {
      return setGuestInputHasError(true);
    }
    if (!_.isNull(me)) {
      return;
    }

    signInAsGuest(guestName, '/');
  }, [guestName, me]);

  React.useEffect(() => {
    setTimeout(() => {
      getProviders().then(setProviders);
    }, 5000);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        margin: '0 auto',
        width: '400px',
        maxWidth: '250px',
        height: '100vh',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {_.isNull(providers) ? (
        <CircularProgress sx={{ flex: 0 }} />
      ) : (
        <>
          <Stack flex={0} spacing={1} width="100%">
            {Object.values(providers).map((provider) => {
              return (
                <Button
                  key={provider.name}
                  size={'large'}
                  variant="outlined"
                  startIcon={icons[provider.name]}
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                >
                  Sign in with {provider.name}
                </Button>
              );
            })}
          </Stack>
          <Box
            flex={0}
            sx={{
              padding: '10px',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Divider sx={{ flex: 1 }} />
            <Typography variant="subtitle2" sx={{ margin: '5px' }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>
          {!showGuestTF && (
            <Box
              flex={0}
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
              width="100%"
            >
              <Button onClick={() => setShowGuestTF(true)} sx={{ flex: 1 }}>
                Sign in as a guest
              </Button>
              <Box
                flex={0}
                sx={{ display: 'flex', alignItems: 'center', margin: '10px' }}
              >
                <Tooltip
                  title="When signing in as a guest all your data will be deleted after
signing out or after 1 month of inactivity"
                >
                  <InfoOutlined />
                </Tooltip>
              </Box>
            </Box>
          )}
          {showGuestTF && (
            <Stack flex={0} spacing={1} width="100%">
              <TextField
                label="Name"
                onChange={onGuestNameChange}
                error={guestInputHasError}
              />
              <Button
                onClick={onGuestSignInClick}
                disabled={guestName.length === 0 || guestInputHasError}
              >
                Sign in
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default SignInPage;
