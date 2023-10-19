import { json } from '@remix-run/node';
import { useFetcher, useLoaderData, useOutletContext } from '@remix-run/react';
import { useEffect } from 'react';

export async function loader() {
  return json({
    message: 'Hello World!',
  });
}

export default function Index() {
  const { message } = useLoaderData<typeof loader>();
  const dataContext = useOutletContext<{ jwtToken: string }>();
  const fetcher = useFetcher();
  console.log('dataContext', dataContext);
  useEffect(() => {
    fetcher.load('/api');
  }, []);

  console.log('fetcher', fetcher);

  return (
    <div className="page">
      <h1>My Blog</h1>
      <main>{message}</main>
      <button
        onClick={() => {
          fetcher.load('/api');
        }}
      >
        refetch
      </button>
    </div>
  );
}
