// in case of error returns an object 
// with properties "ok": false and 
// "result": <error message as string> 
export async function serverRequest(...[url, otherParams]: Parameters<typeof fetch>) {
    try {
        if (!process.env.REACT_APP_BACKEND_URL) {
            throw new Error('Server url is not specified');
        }
        const serverResponse = await fetch(process.env.REACT_APP_BACKEND_URL + url, {
            method: 'GET',
            credentials: 'include',
            ...otherParams,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                ...otherParams?.headers
            },
        });
        if (serverResponse.ok === false) {
            const errorObject = await serverResponse.json();
            throw new Error(errorObject.message);
        }
        const response = {
            ok: serverResponse.ok,
            result: await serverResponse.json(),
        }
        return response;
    } catch (error: unknown) {
        const report = {
            ok: false,
            result: { message: 'Unknown error occurred' } // an object of this type is sent back by server's error handler
        }
        if (error instanceof Error) {
            report.result.message = error.message;
        } else {
            console.error('serverRequest error:');
            console.error(error);
        }
        return report;
    }
}