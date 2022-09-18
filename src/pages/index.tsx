import _ from 'lodash';
import React from 'react';
import {
  useGuestSignIn,
  useMe,
  useSignIn,
  useSignOut,
} from '../auth/users/hooks';

export default function IndexPage() {
  const me = useMe();

  const signIn = useSignIn();
  const guestSignIn = useGuestSignIn();
  const signOut = useSignOut();

  const [userName, setUserName] = React.useState<string>('');

  return (
    <>
      <input onChange={(e) => setUserName(e.target.value)} />
      <h1>{userName}</h1>
      <button onClick={() => guestSignIn(userName)}>Sign in as guest</button>
      <button onClick={() => signIn()}>Sign in</button>
      <button onClick={() => signOut()}>Sign out</button>
      {!_.isNull(me) && (
        <>
          <p>
            {me.isGuest && 'Guest'} {me.name}
          </p>
          <p>{me.email}</p>
          {!_.isNull(me.image) && <img src={me.image} />}
        </>
      )}
    </>
  );
}
