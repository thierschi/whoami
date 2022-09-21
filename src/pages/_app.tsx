import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { withTRPC } from '@trpc/next';
import { SessionProvider } from 'next-auth/react';
import getConfig from 'next/config';
import { AppType } from 'next/dist/shared/lib/utils';
import superjson from 'superjson';
import { AppRouter } from '../server/routers/_app';
import '../styles/global.css';

const { publicRuntimeConfig } = getConfig();

const { APP_URL, WS_URL } = publicRuntimeConfig;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
};

function getEndingLink() {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      url: `${APP_URL}/api/trpc`,
    });
  }
  const client = createWSClient({
    url: WS_URL,
  });
  return wsLink<AppRouter>({
    client,
  });
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' &&
              typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        getEndingLink(),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      headers: { test: 'test' },
      // () => {
      //   return { Test: 'this is a test' };

      //   // if (ctx?.req) {
      //   //   // on ssr, forward client's headers to the server
      //   //   return {
      //   //     ...ctx.req.headers,
      //   //     'x-ssr': '1',
      //   //     Test: 'this is a test',
      //   //   };
      //   // }
      // },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
