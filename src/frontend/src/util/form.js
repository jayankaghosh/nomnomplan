

export const extractFormData = form => {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        const match = key.match(/^(\w+)\[(\w+)\]$/);

        if (match) {
            const field = match[1];
            const index = match[2];

            if (!data[field]) {
                data[field] = {};
            }

            data[field][index] = value;
        } else {
            // Handle normal flat fields
            if (key in data) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
    }

    return data;
};
