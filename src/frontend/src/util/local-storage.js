

const DEFAULT_EXPIRY_HOURS = 30 * 24; // 30 days

export const setData = (key, data, expiryInHours = DEFAULT_EXPIRY_HOURS) => {
    if (data === null) {
        localStorage.removeItem(key);
    } else {
        const now = Date.now();
        const expiry = now + expiryInHours * 60 * 60 * 1000;

        const item = {
            data,
            expiry
        };

        localStorage.setItem(key, JSON.stringify(item));
    }
};

export const getData = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
        const item = JSON.parse(itemStr);
        if (!item.expiry || Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.data;
    } catch (err) {
        console.error("Invalid localStorage data for key:", key);
        return null;
    }
};
