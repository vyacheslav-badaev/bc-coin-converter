import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { fetchQueriesFromRequest } from '~/lib/utils';
import createError from 'http-errors';
import { getBCVerify, removeDataStore } from '~/lib/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    //GET BC queries from request
    const queries = fetchQueriesFromRequest(request);
    const session = await getBCVerify(queries);
    await removeDataStore(session);
    return json({}, { status: 200 });
  } catch (error) {
    const { message } = error as Error & { response?: Response };
    throw createError.InternalServerError(message || 'Server Error');
  }
}
