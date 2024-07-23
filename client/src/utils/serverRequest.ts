export async function serverRequest(...args: Parameters<typeof fetch>) {
    if (!process.env.REACT_APP_BACKEND_URL) {
        throw new Error('Server url is not specified');
    }
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + args[0], {
        method: "GET",
        ...args[1],
        headers: {
            "Content-Type": "application/json",
            "important": "true",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            ...args[1]?.headers
        },
    });
    if (!response.ok) {
        throw new Error("Fetch error");
    }
    const result = await response.json();
    return result;
}