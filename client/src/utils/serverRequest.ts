export async function serverRequest(...args: Parameters<typeof fetch>) {
    if (!process.env.REACT_APP_BACKEND_URL) {
        throw new Error('Server url is not specified');
    }
    const serverResponse = await fetch(process.env.REACT_APP_BACKEND_URL + args[0], {
        method: 'GET',
        credentials: 'include',
        ...args[1],
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            ...args[1]?.headers
        },
    });
    const response = {
        ok: serverResponse.ok,
        result: await serverResponse.json(),
    }
    return response;
}