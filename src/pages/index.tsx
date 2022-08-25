import { gameValidator } from '../service/game';
import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const createGame = trpc.useMutation(['createGame']);

  const onClick = async () => {
    const g = gameValidator.parse(
      await createGame.mutateAsync({
        displayName: 'Lukas',
        id: '4109a65d-1f87-45f1-8682-e749f1a6a17b',
      }),
    );
    console.log(g);
  };

  return (
    <>
      <h1>Hi</h1>
      <button onClick={onClick}>Click me</button>
    </>
  );
}
