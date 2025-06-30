import {getAdminToken, getUserToken} from "./auth";

const uri = '/graphql';


const getRequestHeaders = () => {
    const headers = {};
    const adminToken = getAdminToken();
    if (adminToken) {
        headers['Admin-Token'] = adminToken;
    }
    const userToken = getUserToken();
    if (adminToken) {
        headers['Token'] = userToken;
    }
    return headers;
}

const processException = category => {
    return new Promise((resolve, reject) => {
        if (category === 'authentication') {
            resolve();
            window.location.href = '/';
        }
        reject();
    });
}

export const fetchData = async (query, variables = {}, operationName = 'default') => {
    const rawResponse = await fetch(uri, {
        method: 'POST',
        body: JSON.stringify({
            operationName,
            query,
            variables
        }),
        headers: getRequestHeaders()
    });
    const { errors, data } = await rawResponse.json();
    if (errors) {
        const { message, extensions: { category } } = errors[0];
        try {
            await processException(category);
        } catch (e) {
            throw {
                message,
                category
            }
        }
    }
    return data;
}