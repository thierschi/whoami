import _ from 'lodash';
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';
import Cookies from 'universal-cookie';
import { trpc } from '../../utils/trpc';
import { IUser } from './types';

export const useMe = () => {
  const [user, setUser] = React.useState<IUser | null>(null);

  const session = useSession();
  const me = trpc.useQuery(['me']);

  React.useEffect(() => {
    if (
      session.status === 'loading' ||
      me.isLoading ||
      _.isUndefined(me.data)
    ) {
      return;
    }
    if (!_.isUndefined(me.data) && _.isNull(me.data)) {
      // TODO navigate to sign in page
      return;
    }
    setUser(me.data);
  }, [session, me]);

  return user;
};

export const useSignIn = () => signIn;

export const useGuestSignIn = () => {
  const regGuestUser = trpc.useMutation(['registerGuestUser']);

  const signInCallback = React.useCallback(
    async (name: string) => {
      const user = await regGuestUser.mutateAsync(name);

      const cookies = new Cookies();
      cookies.set('whoami.guest.id', user.id);
      cookies.set('whoami.guest.secret', user.secret);
      window.location.reload();
    },
    [regGuestUser],
  );

  return signInCallback;
};

export const useSignOut = () => {
  const session = useSession();
  const signOutGuest = trpc.useMutation('signOutGuest');

  const signOutCallback = React.useMemo(() => {
    if (session.status === 'unauthenticated') {
      return () => {
        signOutGuest.mutate();

        const cookies = new Cookies();
        cookies.remove('whoami.guest.id');
        cookies.remove('whoami.guest.secret');

        window.location.reload();
      };
    }
    return signOut;
  }, [session]);

  return signOutCallback;
};
