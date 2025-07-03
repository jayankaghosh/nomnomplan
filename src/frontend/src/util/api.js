import {getAdminToken, getUserToken, setAdminToken, setUserToken} from "util/auth";
import {ADMIN_DASHBOARD, ADMIN_LOGIN, LOGIN} from "pages/routes.config";

const uri = '/graphql';
const controllers = {};

const getRequestHeaders = () => {
    const headers = {};
    const adminToken = getAdminToken();
    if (adminToken) {
        headers['Admin-Token'] = adminToken;
    }
    const userToken = getUserToken();
    if (userToken) {
        headers['Token'] = userToken;
    }
    return headers;
}

const processException = category => {
    return new Promise((resolve, reject) => {
        if (category === 'authentication') {
            let targetUrl;
            if (window.location.pathname.startsWith(ADMIN_DASHBOARD)) {
                setAdminToken(null);
                targetUrl = ADMIN_LOGIN;
            } else {
                setUserToken(null);
                targetUrl = LOGIN
            }
            resolve();
            window.location.href = targetUrl;
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