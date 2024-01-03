import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import {
  commitCookies,
  encodePayload,
  getBCAuth,
  getCookies,
  setSession,
} from '~/lib/auth.server';
import { fetchQueriesFromRequest } from '~/lib/utils';
import createError from 'http-errors';
/*
 * Bigcommerce Auth endpoint
 * Link: https://developer.bigcommerce.com/api-docs/getting-started/authentication/rest-api-authentication#oauth-2
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    //GET BC queries from request
    const queries = fetchQueriesFromRequest(request);
    const session = await getBCAuth(queries);
    const encodedContext = encodePayload(session);
    await setSession(session);
    const cookies = await getCookies(request.headers.get('Cookie'));
    // Save session context to cookie
    cookies.set('context', encodedContext);
    return redirect(`/`, {
      headers: {
        'Set-Cookie': await commitCookies(cookies),
      },
      status: 302,
    });
  } catch (error) {
    const { message } = error as Error & { response?: Response };
    throw createError.InternalServerError(message || 'Server Error');
  }
}
