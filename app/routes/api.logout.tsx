import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import {
  commitCookies,
  destroyCookies,
  getContextFromCookies,
  getCookies,
  getSession,
  logoutUser,
} from '~/lib/auth.server';
import { fetchQueriesFromRequest } from '~/lib/utils';
import type { SessionContextProps } from '~/types';
import createError from 'http-errors';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    //GET cookies from request
    const cookies = await getCookies(request.headers.get('Cookie'));
    if (!cookies.get('context')) {
      return json(
        {
          message: 'No session found',
        },
        {
          status: 200,
        },
      );
    }
    let session = null;
    // Try get session from DataStore by context
    try {
      session = await getSession(cookies.get('context'));
    } catch (error) {
      // If no session found, return 200
      if (((error as Error).message || '').includes('User is not available')) {
        return json(
          {
            message: 'No session found',
          },
          {
            status: 200,
          },
        );
      }
      // Otherwise throw error
      throw createError.BadRequest((error as Error)?.message || 'Bad Request');
    }

    await logoutUser(session as SessionContextProps);
    // Remove session context to cookie
    return json(
      {
        message: 'Logout successful',
      },
      {
        headers: {
          'Set-Cookie': await destroyCookies(cookies),
        },
        status: 200,
      },
    );
  } catch (error) {
    const { message } = error as Error & { response?: Response };
    throw createError.InternalServerError(message || 'Server Error');
  }
}
