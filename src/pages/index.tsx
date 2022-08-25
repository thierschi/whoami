import { trpc } from 'utils/trpc';

export default function IndexPage() {
  const add = trpc.useMutation(['add']);
  trpc.useSubscription(['onAdd'], {
    onNext(data) {
      console.log(data);
    },
  });

  return (
    <>
      <h1>Hi</h1>
      <button onClick={() => add.mutate({ text: 'cock' })}>Click me</button>
    </>
  );
}
