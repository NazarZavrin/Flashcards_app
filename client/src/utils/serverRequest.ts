// in case of error returns an object 
// with properties "ok": false and 
// "result": <error message as string> 

type serverResponse = {
    ok: true;
    result: any;
} | {
    ok: false;
    result: {
        message: string;
    }
};
let isRetry = false;
let counter = 0;
export async function serverRequest(...[url, otherParams]: Parameters<typeof fetch>): Promise<serverResponse> {
    ++counter;
    // console.log(`${counter}) serverRequest ${url}, isRetry: ${isRetry}`);
    try {
        if (!process.env.REACT_APP_BACKEND_URL) {
            throw new Error('Server url is not specified');
        } else if (counter >= 25) {
            throw new Error('Big number of serverRequest calls');
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
        if (serverResponse.status === 401 && !isRetry) {
            isRetry = true;
            try {
                // console.log(`isRetry -> true: ${isRetry}`);
                const refreshResponse = await serverRequest('/users/refresh');
                const refreshResult = refreshResponse.result;
                if (refreshResponse.ok) {
                    localStorage.setItem('accessToken', refreshResult.accessToken);
                } else {
                    const errorMessage = refreshResult.message;
                    throw new Error(errorMessage);
                }
                // console.log(`return serverRequest(url, otherParams)`);
                const retryResponse = await serverRequest(url, otherParams);
                isRetry = false;
                return retryResponse;
            } catch (error: unknown) {
                isRetry = false;
                throw new Error('Refresh error: ' + (error instanceof Error ? error.message : error));
            }
        }
        if (serverResponse.ok === false) {
            const errorObject = await serverResponse.json();
            throw new Error(errorObject.message);
        }
        const response: serverResponse = {
            ok: serverResponse.ok,
            result: await serverResponse.json(),
        }
        // console.log('success');
        counter--;
        return response;
    } catch (error: unknown) {
        const report: serverResponse = {
            ok: false,
            result: { message: 'Unknown error occurred' } // an object of this type is sent back by server's error handler
        }
        if (error instanceof Error) {
            report.result.message = error.message;
        } else {
            console.error('serverRequest error:');
            console.error(error);
        }
        // console.log('fail');
        counter--;
        return report;
    }
}