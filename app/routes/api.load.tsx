import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import {
  buildRedirectUrl,
  encodePayload,
  getBCVerify,
  setSession,
} from '~/lib/auth';
import { fetchQueriesFromRequest } from '~/lib/utils';
import createError from 'http-errors';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const queries = fetchQueriesFromRequest(request);
    // Verify when app loaded (launch)
    const session = await getBCVerify(queries);
    const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering
    await setSession(session);
    return redirect(buildRedirectUrl(session.url, encodedContext), 302);
  } catch (error) {
    const { message } = error as Error & { response?: Response };
    throw createError.InternalServerError(message || 'Server Error');
  }
}
