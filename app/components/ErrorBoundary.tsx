import { isRouteErrorResponse, useRouteError } from '@remix-run/react';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const error = useRouteError();
  // No error render the children
  if (!error) return <>{children}</>;

  // Detect error type and render
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return (
      <>
        <h1>Unknown Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </>
    );
  }
}
