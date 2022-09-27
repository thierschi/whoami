import { Button } from '@mui/material';
import _ from 'lodash';
import { useMe, useSignOut } from '../../auth/users/hooks';
import { trpc } from '../../utils/trpc';

const GamePage: React.FunctionComponent = (): JSX.Element => {
  const me = useMe();
  const signOut = useSignOut();

  const createGame = trpc.useMutation(['createNewGame']);

  const onClick = async () => {
    const game = await createGame.mutateAsync();
    console.log(game);
  };

  return (
    <>
      <h1>Game</h1>
      {!_.isNull(me) && (
        <>
          <b>
            {me.name}
            {me.isGuest && ' as a guest'}
          </b>
          <p>{me.email}</p>
        </>
      )}
      <Button onClick={() => signOut()}>Sign out</Button>
      <br />
      <Button onClick={onClick}>Create Game</Button>
    </>
  );
};

export default GamePage;