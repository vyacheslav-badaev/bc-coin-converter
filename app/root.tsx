import { cssBundleHref } from '@remix-run/css-bundle';
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
import { fetchQueriesFromRequest } from './lib/utils';
import { bigCommerceSDK } from './lib/bc-sdk';
import { useEffect } from 'react';
import { getContextFromCookies } from './lib/auth';
import { ErrorBoundary } from './components/ErrorBoundary';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const context = await getContextFromCookies(request);
  return json({
    context,
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  let outlet = !data.context ? (
    <h1 className="error">Context session is not provided.Try reopen app</h1>
  ) : (
    <Outlet context={data} />
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
