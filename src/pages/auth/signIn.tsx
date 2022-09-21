import { GitHub } from '@mui/icons-material';
import { Box, Button, TextField } from '@mui/material';
import _ from 'lodash';
import { BuiltInProviderType, Provider } from 'next-auth/providers';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import * as React from 'react';

interface IProps {
  providers: Provider[];
}
type NextAuthProviders = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

const icons: Record<string, JSX.Element> = {
  GitHub: <GitHub />,
};

const SignInPage: React.FunctionComponent = (): JSX.Element => {
  const [providers, setProviders] = React.useState<NextAuthProviders | null>(
    null,
  );

  React.useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  // console.log(props.providers);
  // const providers = Object.values(props.providers);
  // console.log(providers);

  if (_.isNull(providers)) {
    return <h1>Loading...</h1>;
  }

  return (
    <Box sx={{ width: '250px' }}>
      <Box>
        {Object.values(providers).map((provider) => {
          return (
            <div key={provider.name}>
              <Button
                variant="outlined"
                startIcon={icons[provider.name]}
                onClick={() => signIn(provider.id)}
              >
                Sign in with {provider.name}
              </Button>
            </div>
          );
        })}
      </Box>
      <Box>
        <TextField label="Name" variant="outlined" sx={{ width: '100%' }} />
      </Box>
      <Box>
        <Button>Play as guest</Button>
      </Box>
    </Box>
  );
};

export default SignInPage;

{
  /* {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        );
      })} */
}

// export const getServerSideProps = async () => {
//   return {
//     props: {
//       providers: await getProviders(),
//     },
//   };
// };
