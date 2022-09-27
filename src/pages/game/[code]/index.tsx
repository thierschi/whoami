import { useRouter } from 'next/router';
import * as React from 'react';

const GameLobby: React.FunctionComponent = (): JSX.Element => {
  const router = useRouter();
  const { code } = router.query;

  return <h1>{code}</h1>;
};

export default GameLobby;
