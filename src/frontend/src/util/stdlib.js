import { useEffect, useState } from 'react';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);


export const useDebounce = (value, delay = 500) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounced(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
};

export const ucwords = str => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

export const getLocalTime = utc => {
    return dayjs.utc(utc).local();
}

export const formatPrice = (amount, currency = 'INR') => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "INR" }).format(amount);
}