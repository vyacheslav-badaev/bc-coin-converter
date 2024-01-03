import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import {
  buildRedirectUrl,
  commitCookies,
  encodePayload,
  getBCVerify,
  getCookies,
  setSession,
} from '~/lib/auth.server';
import { fetchQueriesFromRequest } from '~/lib/utils';
import createError from 'http-errors';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    //GET BC queries from request
    const queries = fetchQueriesFromRequest(request);
    // Verify when app loaded (launch)
    const session = await getBCVerify(queries);
    const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering
    await setSession(session);
    const cookies = await getCookies(request.headers.get('Cookie'));
    // Save session context to cookie
    cookies.set('context', encodedContext);
    return redirect(session.url, {
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
