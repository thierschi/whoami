import _ from 'lodash';
import React from 'react';
import { IUser, userValidator } from '../service/user/types';
import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const createUser = trpc.useMutation(['createUser']);
  const changeUserName = trpc.useMutation(['changeUserName']);

  const [user, setUser] = React.useState<IUser | null>(null);

  React.useEffect(() => console.log(user), [user]);

  const onClick = async () => {
    const rUser = await createUser.mutateAsync('Lukas');

    setUser(userValidator.parse(rUser));
  };

  const onClickChange = async () => {
    if (_.isNull(user)) return;

    const newUser = await changeUserName.mutateAsync({
      ...user,
      name: 'thierschi',
    });
    setUser(userValidator.parse(newUser));
  };

  return (
    <>
      <h1>Hi</h1>
      <button onClick={onClick}>click me</button>
      <button onClick={onClickChange}>click me</button>
    </>
  );
}
