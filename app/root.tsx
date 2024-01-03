import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { bigCommerceSDK } from './lib/bc-sdk';
import { useEffect } from 'react';
import { getContextFromCookies, getSession } from './lib/auth.server';
import { ErrorBoundary } from './components/ErrorBoundary';
import createError from 'http-errors';
import { GlobalStyles } from '@bigcommerce/big-design';
import styles from '~/styles/global.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;600&display=swap',
  },
  { rel: 'stylesheet', href: styles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const context = await getContextFromCookies(request);
  const session = await getSession(context);
  if (!session?.user) {
    throw createError.Forbidden('No session found');
  }

  return json({
    context,
    session: session.user,
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  let outlet = !data.context ? (
    <h1 className="error">Context session is not provided</h1>
  ) : (
    <Outlet />
  );

  useEffect(() => {
    if (data.context) {
      console.log('data.context init', data.context);
      // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
      bigCommerceSDK();
    }
  }, [data.context]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <GlobalStyles />
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorBoundary>{outlet}</ErrorBoundary>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
