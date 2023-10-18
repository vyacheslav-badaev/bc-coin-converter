import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { getBCVerify, removeDataStore } from '~/lib/auth';
import { fetchQueriesFromRequest } from '~/lib/utils';
import createError from 'http-errors';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const queries = fetchQueriesFromRequest(request);
    const session = await getBCVerify(queries);
    await removeDataStore(session);
    return json({}, { status: 200 });
  } catch (error) {
    const { message } = error as Error & { response?: Response };
    throw createError.InternalServerError(message || 'Server Error');
  }
}
