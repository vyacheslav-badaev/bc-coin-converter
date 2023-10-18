import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { fetchQueriesFromRequest } from '~/lib/utils';
import createError from 'http-errors';
import { getBCVerify, removeDataStore } from '~/lib/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const queries = fetchQueriesFromRequest(request);
    // eslint-disable-next-line no-console
    console.log('user-remove queries', queries);
    const session = await getBCVerify(queries);
    await removeDataStore(session);
    return json({}, { status: 200 });
  } catch (error) {
    const { message } = error as Error & { response?: Response };
    throw createError.InternalServerError(message || 'Server Error');
  }
}
