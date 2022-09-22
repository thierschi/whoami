import { Button } from '@mui/material';
import _ from 'lodash';
import { useMe, useSignOut } from '../../auth/users/hooks';

const GamePage: React.FunctionComponent = (): JSX.Element => {
  const me = useMe();
  const signOut = useSignOut();

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
    </>
  );
};

export default GamePage;
