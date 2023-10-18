import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { getSession, logoutUser } from '~/lib/auth';
import { fetchQueriesFromRequest } from '~/lib/utils';
import type { SessionContextProps } from '~/types';
import createError from 'http-errors';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const queries = fetchQueriesFromRequest(request);
    const session = await getSession(queries.context);
    await logoutUser(session as SessionContextProps);
    return json({}, { status: 200 });
  } catch (error) {
    const { message } = error as Error & { response?: Response };
    throw createError.InternalServerError(message || 'Server Error');
  }
}
