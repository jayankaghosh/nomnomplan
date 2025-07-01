import {getAdminToken, getUserToken} from "util/auth";
import {ADMIN_LOGIN} from "pages/routes.config";

const uri = '/graphql';
const controllers = {};

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
            window.location.href = ADMIN_LOGIN;
        }
        reject();
    });
}

export const fetchData = async (query, variables = {}, operationName = 'default') => {
    if (controllers[operationName]) {
        controllers[operationName].abort();
    }

    const controller = new AbortController();
    controllers[operationName] = controller;

    try {
        const rawResponse = await fetch(uri, {
            method: 'POST',
            body: JSON.stringify({
                operationName,
                query,
                variables
            }),
            headers: getRequestHeaders(),
            signal: controller.signal
        });
        const {errors, data} = await rawResponse.json();
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
    } catch (err) {
        if (err.name === 'AbortError') {
            throw {
                category: 'aborted',
                message: 'Aborted'
            }
        }
        throw err;
    }
}