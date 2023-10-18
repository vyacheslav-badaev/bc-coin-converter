import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { encodePayload, getBCAuth, setSession } from '~/lib/auth';
import { fetchQueriesFromRequest } from '~/lib/utils';
import createError from 'http-errors';
/*
 * Bigcommerce Auth endpoint
 * Link: https://developer.bigcommerce.com/api-docs/getting-started/authentication/rest-api-authentication#oauth-2
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const queries = fetchQueriesFromRequest(request);
    const session = await getBCAuth(queries);
    const encodedContext = encodePayload(session);
    await setSession(session);
    return redirect(`/?context=${encodedContext}`, 302);
  } catch (error) {
    const { message } = error as Error & { response?: Response };
    throw createError.InternalServerError(message || 'Server Error');
  }
}
