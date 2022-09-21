import _ from 'lodash';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useMe } from '../auth/users/hooks';

export default function IndexPage() {
  const me = useMe();
  const router = useRouter();

  React.useEffect(() => {
    if (!_.isNull(me)) {
      router.push('home');
    }
  }, [me]);

  return (
    <>
      <h1>Start</h1>
      <button onClick={() => signIn()}>Start</button>
    </>
  );
}
