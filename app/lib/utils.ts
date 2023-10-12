export const fetchQueriesFromRequest = (req: Request) => {
    // parse the search params for `?q=`
    const url = new URL(req.url)
    const queries: Record<string, string> = {}
    for (const [key, value] of url.searchParams.entries()) {
        queries[key] = value
    }

    return queries
}
