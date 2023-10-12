import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export async function loader() {
    return json({
        message: 'Hello World!',
    })
}

export default function Index() {
    const { message } = useLoaderData<typeof loader>()
    return (
        <div className="page">
            <h1>My Blog</h1>
            <main>{message}</main>
        </div>
    )
}
