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

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { context: jwtToken = '' } = fetchQueriesFromRequest(request);
  return json({
    jwtToken,
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  let outlet = !data.jwtToken ? (
    <h1 className="error">Token is not provided</h1>
  ) : (
    <Outlet context={data} />
  );

  useEffect(() => {
    if (data.jwtToken) {
      console.log('data.jwtToken init', data.jwtToken);
      // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
      bigCommerceSDK(data.jwtToken);
    }
  }, [data.jwtToken]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {outlet}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
