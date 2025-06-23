

export const extractFormData = form => {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        // If the key already exists, convert to array
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

    return data;
}