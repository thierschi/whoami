import type { NextPage } from 'next';
import { trpc } from '../util/trpc';

const Home: NextPage = () => {
    const hello = trpc.useQuery(['hello', { text: 'Lukas' }]);

    if (hello.isLoading) return <h1>Loading...</h1>;

    if (hello.data) return <h1>{hello.data.greeting}</h1>;

    return <h1>Hello</h1>;
};

export default Home;
