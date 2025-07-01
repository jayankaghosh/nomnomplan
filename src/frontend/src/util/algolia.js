import { algoliasearch } from 'algoliasearch';

export const search = async (indexName, queryText) => {
    const client = algoliasearch(
        process.env.REACT_APP_ALGOLIA_APP_ID,
        process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY,
    );
    try {
        const { hits } = await client.searchSingleIndex({
            indexName: indexName +'_index',
            searchParams: { query: queryText }
        });
        return hits;
    } catch (err) {
        console.error(err);
        throw {
            category: 'algolia-error',
            message: 'Could not search algolia'
        }
    }
}