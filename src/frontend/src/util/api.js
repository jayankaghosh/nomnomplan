
const uri = '/graphql';

export const fetchData = async (query, variables = {}, operationName = 'default') => {
    const rawResponse = await fetch(uri, {
        method: 'POST',
        body: JSON.stringify({
            operationName,
            query,
            variables
        })
    });
    const { errors, data } = await rawResponse.json();
    if (errors) {
        const { message, extensions: { category } } = errors[0];
        throw {
            message,
            category
        }
    }
    return data;
}