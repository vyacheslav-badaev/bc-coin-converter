import { json } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { fetchQueriesFromRequest } from '~/lib/utils'
/*
 * Bigcommerce Auth endpoint
 * Link: https://developer.bigcommerce.com/api-docs/getting-started/authentication/rest-api-authentication#oauth-2
 */
export async function loader({ request }: LoaderFunctionArgs) {
    const queries = fetchQueriesFromRequest(request)
    console.log('queries', queries)
    return json({
        message: 'TEST API Base Route',
    })
}
