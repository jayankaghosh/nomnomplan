

export const getCurrentUrl = () => window.location.href;

export const getQueryParams = (url) => {
    if (!url) url = getCurrentUrl();
    const params = new URL(url).searchParams;
    const result = {};

    for (const [key, value] of params.entries()) {
        if (result[key]) {
            result[key] = Array.isArray(result[key])
                ? [...result[key], value]
                : [result[key], value];
        } else {
            result[key] = value;
        }
    }

    return result;
};

// Get the URI (path + query + hash)
export const getURI = (url) => {
    if (!url) url = getCurrentUrl();
    const { pathname, search, hash } = new URL(url);
    return `${pathname}`;
};