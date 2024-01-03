import { LoaderFunctionArgs, json } from '@remix-run/node';
import {
  commitCookies,
  getContextFromCookies,
  getCookies,
  getSession,
} from '~/lib/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  //GET get context from cookies and load session
  const context = await getContextFromCookies(request);
  const session = await getSession(context);
  //GET cookies from request
  return json(
    {
      message: 'Welcome API Base Route3',
    },
    {
      status: 200,
    },
  );
}
