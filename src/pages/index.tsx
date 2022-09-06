import { signOut } from 'next-auth/react';
import Cookies from 'universal-cookie';
import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const regUser = trpc.useMutation(['registerGuestUser']);
  const ping = trpc.useMutation(['ping']);

  const onClick = async () => {
    const user = await regUser.mutateAsync('Lukas');
    console.log(user);

    const cookies = new Cookies();
    cookies.set('whoami.guest.id', user.id);
    cookies.set('whoami.guest.secret', user.secret);
  };

  return (
    <>
      <h1>Hello</h1>
      <button onClick={onClick}>Click me</button>
      <button onClick={() => signOut()}>Log out</button>
      <button onClick={() => ping.mutateAsync().then(console.log)}>ping</button>
    </>
  );
}
